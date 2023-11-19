# DistilBERT

# 步骤
1. 加载DistilBERT模型：我使用Hugging Face的transformers库来加载预训练的DistilBERT模型。

2. 特征提取：使用DistilBERT模型提取问题告警和变更描述的特征。

3. 构建关联度评估模型：构建一个机器学习模型来处理这些特征并预测关联度分数。

4. 训练模型：使用您提供的数据集训练这个模型。

4. 评估和使用：使用训练好的模型来评估新的问题告警和变更列表。