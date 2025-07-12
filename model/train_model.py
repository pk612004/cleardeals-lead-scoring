import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import accuracy_score
import joblib

# 🚀 Load cleaned dataset
df = pd.read_csv("data/cleaned_dataset.csv")

# 🧼 Clean column names (removes hidden spaces/tabs)
df.columns = df.columns.str.strip()
print("🧾 Cleaned Column Names:")
print(df.columns.tolist())


# 🎯 Select features and target
features = ['Income', 'Kidhome', 'Teenhome', 'Recency', 'NumWebPurchases', 'NumCatalogPurchases']
X = df[features]
y = df["High_Intent"]

# ✂️ Split into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 🧠 Train Gradient Boosting Classifier
model = GradientBoostingClassifier()
model.fit(X_train, y_train)

# 📈 Evaluate model
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"\n✅ Model trained with accuracy: {accuracy:.2f}")

# 🧠 (Optional) Show feature importance
importances = model.feature_importances_
for name, score in zip(features, importances):
    print(f"📊 {name}: {score:.4f}")

# 💾 Save the model to disk
joblib.dump(model, "model/intent_model.pkl")
print("✅ Model saved as 'model/intent_model.pkl'")
