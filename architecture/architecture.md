                ┌─────────────────────┐
                │  User Input Form    │
                │ symptoms + history  │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │ Risk Assessment AI  │
                │ (Tabular model)     │
                └──────────┬──────────┘
                           │
                    Risk > threshold?
                       /         \
                     No           Yes
                     │             │
               Healthy Advice      ▼
                             ┌───────────────┐
                             │ Request ECG   │
                             │ / imaging     │
                             └──────┬────────┘
                                    │
                                    ▼
                         ┌───────────────────┐
                         │ Diagnostic Model  │
                         │ CNN / Transformer │
                         └─────────┬─────────┘
                                   │
                                   ▼
                       ┌─────────────────────┐
                       │ Disease Prediction  │
                       └─────────────────────┘