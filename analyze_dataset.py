import pandas as pd

# Load the data
df = pd.read_csv("data/cleaned_dataset.csv", sep="\t")

# Drop rows with missing income (just to simplify)
df = df.dropna(subset=["Income"])

# Add a new empty 'Comments' column
df["Comments"] = ""

# Rename 'Response' to 'High_Intent'
df.rename(columns={"Response": "High_Intent"}, inplace=True)

# Save cleaned CSV
df.to_csv("data/cleaned_dataset.csv", sep=",", index=False)


print("✅ Cleaned dataset saved as 'cleaned_dataset.csv'")

#df.to_csv("data/cleaned_dataset.csv", sep=",", index=False)
