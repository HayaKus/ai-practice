from transformers import DistilBertModel, DistilBertTokenizer
import torch

# 加载预训练的DistilBERT模型和分词器
model_name = 'distilbert-base-uncased'
tokenizer = DistilBertTokenizer.from_pretrained(model_name)
model = DistilBertModel.from_pretrained(model_name)

# 示例函数：使用DistilBERT提取文本特征
def extract_features(text):
    # 对文本进行分词
    # token长度是512，padding=True：如果文本短于512token，填充；truncation=True：如果文本长于512token，截断
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=512)
    # 使用DistilBERT模型获取文本的特征表示
    with torch.no_grad(): # 禁用梯度计算
        outputs = model(**inputs)
    # 取第一个token的输出作为整个句子的特征
    return outputs.last_hidden_state[:, 0, :].numpy()

# 示例文本
sample_text = "Network latency issues after server update."

# 提取特征
features = extract_features(sample_text)
print(features.shape) # 查看特征的维度
