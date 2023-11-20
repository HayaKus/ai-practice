from sklearn.ensemble import IsolationForest
import pandas as pd
from distilbert import compute_features_and_save

def train(train_data_file):
    # 加载特征数据
    features = pd.read_csv(train_data_file)

    # 创建孤立森林模型
    # contamination参数定义了数据集中异常点的预期比例
    iso_forest = IsolationForest(n_estimators=100, random_state=42, contamination=0.1)

    # 训练模型
    iso_forest.fit(features)
    return iso_forest

def predict(predict_data_file, model):
    # 用distilbert将数据变成特征
    file_name = compute_features_and_save(predict_data_file, 'predict')

    # 加载特征数据
    features = pd.read_csv(file_name)

    # 这将返回一个数组，其中-1表示异常，1表示正常
    predictions = model.predict(features)
    # 将预测结果添加到数据框架中
    features['anomaly'] = predictions
    return features


iso_forest = train('data/features_train.csv')
features = predict('data/online_issues_predict.csv', iso_forest)
print(features)
