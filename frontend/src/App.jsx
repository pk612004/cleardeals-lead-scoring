import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [formData, setFormData] = useState({
    email: "",
    income: "",
    kidhome: "",
    teenhome: "",
    recency: "",
    num_web_purchases: "",
    num_catalog_purchases: "",
    comments: "",
    consent: false,
  });

  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [submittedLeads, setSubmittedLeads] = useState([]);


  useEffect(() => {
    const savedLeads = localStorage.getItem("submittedLeads");
    if (savedLeads) {
      setSubmittedLeads(JSON.parse(savedLeads));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("submittedLeads", JSON.stringify(submittedLeads));
  }, [submittedLeads]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData({
      ...formData,
      [name]: val,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        income: Number(formData.income),
        kidhome: Number(formData.kidhome),
        teenhome: Number(formData.teenhome),
        recency: Number(formData.recency),
        num_web_purchases: Number(formData.num_web_purchases),
        num_catalog_purchases: Number(formData.num_catalog_purchases),
      };

      const res = await axios.post("http://127.0.0.1:8000/score", payload);
      setResponse(res.data);
      setError(null);
      setSubmittedLeads((prev) => [...prev, res.data]);
    } catch (err) {
      console.error(err);
      setError("❌ Error submitting form. Please try again.");
      setResponse(null);
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "auto", padding: "20px" }}>
      <h1>📊 Lead Scoring Form</h1>
      <form onSubmit={handleSubmit}>
        {[
          { name: "email", label: "Email", type: "text" },
          { name: "income", label: "Income", type: "number" },
          { name: "kidhome", label: "Kids at Home", type: "number" },
          { name: "teenhome", label: "Teens at Home", type: "number" },
          { name: "recency", label: "Recency (days since last purchase)", type: "number" },
          { name: "num_web_purchases", label: "Web Purchases", type: "number" },
          { name: "num_catalog_purchases", label: "Catalog Purchases", type: "number" },
          { name: "comments", label: "Additional Comments", type: "text" },
        ].map((field) => (
          <div key={field.name} style={{ marginBottom: "10px" }}>
            <label>{field.label}</label>
            <input
              name={field.name}
              type={field.type}
              value={formData[field.name]}
              onChange={handleChange}
              required={field.name !== "comments"}
              style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            />
          </div>
        ))}

        <label>
          <input
            name="consent"
            type="checkbox"
            checked={formData.consent}
            onChange={handleChange}
            required
          />
          &nbsp;I give consent
        </label>

        <br />
        <button
          type="submit"
          style={{
            marginTop: "15px",
            padding: "10px 20px",
            backgroundColor: "royalblue",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          SUBMIT
        </button>
      </form>

      {response && (
        <div style={{ marginTop: "20px", background: "#f0f0f0", padding: "10px" }}>
          <h3>✅ Lead Score Result</h3>
          <p><strong>Email:</strong> {response.email}</p>
          <p><strong>Initial Score:</strong> {response.initial_score}</p>
          <p><strong>Reranked Score:</strong> {response.reranked_score}</p>
          <p><strong>Comments:</strong> {response.comments}</p>
        </div>
      )}

      {error && (
        <div style={{ marginTop: "20px", color: "red" }}>
          {error}
        </div>
      )}

      {submittedLeads.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h2>🧾 All Submitted Leads</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#eee" }}>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Email</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Initial Score</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Reranked Score</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Comments</th>
              </tr>
            </thead>
            <tbody>
              {submittedLeads.map((lead, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{lead.email}</td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{lead.initial_score}</td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{lead.reranked_score}</td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{lead.comments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default App;
