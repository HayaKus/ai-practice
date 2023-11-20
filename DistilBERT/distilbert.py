from transformers import DistilBertModel, DistilBertTokenizer
import torch
import pandas as pd

def extract_features(text, model, tokenizer):
    """ 使用DistilBERT提取单个文本的特征 """
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=512)
    with torch.no_grad():
        outputs = model(**inputs)
    return outputs.last_hidden_state[:, 0, :].numpy().flatten()

def compute_features_and_save(dataFile, step):
    # 加载预训练的DistilBERT模型和分词器
    model_name = 'distilbert-base-uncased'
    tokenizer = DistilBertTokenizer.from_pretrained(model_name)
    model = DistilBertModel.from_pretrained(model_name)

    # 读取CSV文件
    data = pd.read_csv(dataFile)

    # 使用DistilBERT提取特征
    features = []
    for _, row in data.iterrows():
        problem_feature = extract_features(row['online_problem'], model, tokenizer)
        change_feature = extract_features(row['change_description'], model, tokenizer)
        combined_feature = list(problem_feature) + list(change_feature)
        features.append(combined_feature)

    # 将特征保存到新的CSV文件
    features_df = pd.DataFrame(features)
    file_name = f'data/features_{step}.csv'
    features_df.to_csv(file_name, index=False)

    return file_name


compute_features_and_save('data/online_issues_train.csv', 'train')
