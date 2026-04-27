export type Dataset = {
  id: string;
  name: string;
  rows: number;
  uploadedAt: string;
  fairnessScore: number;
  status: "safe" | "warning" | "high-risk";
  domain: string;
};

export const mockDatasets: Dataset[] = [
  { id: "ds_001", name: "Hiring Q4 2025", rows: 12450, uploadedAt: "2026-04-22", fairnessScore: 87, status: "safe", domain: "Hiring" },
  { id: "ds_002", name: "Loan Approvals — Region East", rows: 8230, uploadedAt: "2026-04-19", fairnessScore: 64, status: "warning", domain: "Finance" },
  { id: "ds_003", name: "University Admissions 2026", rows: 5420, uploadedAt: "2026-04-15", fairnessScore: 42, status: "high-risk", domain: "Education" },
  { id: "ds_004", name: "Insurance Claims Triage", rows: 9870, uploadedAt: "2026-04-10", fairnessScore: 78, status: "safe", domain: "Insurance" },
  { id: "ds_005", name: "Employee Performance Review", rows: 3210, uploadedAt: "2026-04-04", fairnessScore: 71, status: "warning", domain: "HR" },
];

export const fairnessMetrics = {
  overall: 76,
  genderBias: 18,
  ageBias: 12,
  selectionRate: [
    { group: "Male", rate: 0.62 },
    { group: "Female", rate: 0.48 },
    { group: "Non-binary", rate: 0.55 },
  ],
  errorRates: [
    { group: "Male", fpr: 0.08, fnr: 0.12 },
    { group: "Female", fpr: 0.14, fnr: 0.21 },
    { group: "Non-binary", fpr: 0.11, fnr: 0.18 },
  ],
  statisticalParity: 0.14,
  equalOpportunity: 0.82,
  disparateImpact: 0.77,
};

export const featureImportance = [
  { feature: "Years of Experience", importance: 0.28 },
  { feature: "Education Level", importance: 0.22 },
  { feature: "Skill Match Score", importance: 0.19 },
  { feature: "Previous Salary", importance: 0.12 },
  { feature: "Location", importance: 0.09 },
  { feature: "Gender (proxy)", importance: 0.06 },
  { feature: "Age", importance: 0.04 },
];

export const trendData = [
  { month: "Nov", score: 62 },
  { month: "Dec", score: 68 },
  { month: "Jan", score: 71 },
  { month: "Feb", score: 70 },
  { month: "Mar", score: 74 },
  { month: "Apr", score: 76 },
];

export const recentPredictions = [
  { id: "p1", candidate: "Candidate #4821", decision: "Approved", confidence: 0.92, fairnessFlag: false },
  { id: "p2", candidate: "Candidate #4822", decision: "Rejected", confidence: 0.74, fairnessFlag: true },
  { id: "p3", candidate: "Candidate #4823", decision: "Approved", confidence: 0.88, fairnessFlag: false },
  { id: "p4", candidate: "Candidate #4824", decision: "Rejected", confidence: 0.81, fairnessFlag: true },
  { id: "p5", candidate: "Candidate #4825", decision: "Approved", confidence: 0.95, fairnessFlag: false },
];

export const recommendations = [
  { title: "Rebalance training dataset", priority: "high", impact: "+12 fairness pts", description: "Female representation is 34% — increase to at least 45% via SMOTE oversampling or targeted data collection." },
  { title: "Remove biased proxy features", priority: "high", impact: "+8 fairness pts", description: "‘Postal Code’ correlates 0.71 with race. Drop it or apply disparate impact remover." },
  { title: "Apply fairness constraints during training", priority: "medium", impact: "+6 fairness pts", description: "Use equalized odds post-processing on model outputs to equalize error rates across groups." },
  { title: "Increase minority group samples", priority: "medium", impact: "+5 fairness pts", description: "Non-binary group has only 142 samples (1.1%). Aim for ≥5% representation." },
  { title: "Enable human-in-the-loop review", priority: "low", impact: "Risk mitigation", description: "Route low-confidence (<0.7) predictions affecting protected groups to human reviewers." },
  { title: "Retrain with adversarial debiasing", priority: "medium", impact: "+9 fairness pts", description: "Add an adversarial network that penalizes the model for predicting protected attributes." },
];