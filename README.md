# Secure Pay Router


This is a mini backend service built with **Node.js** and **TypeScript** that simulates a secure payment gateway proxy. It detects fraud risk based on custom rules, routes payments accordingly, and uses **LLMs** (Groq, Gemini) to generate human-readable explanations for each transaction decision.

---

## 🚀 Features

- Fraud detection engine using heuristic rules (amount, domain, patterns)
- AI explanation via Groq and Gemini with fallback strategy
- Smart payment routing: block, Stripe, or PayPal
- LLM response caching (prompt → response) for performance
- Input validation using Joi
- Rate-limiting to prevent abuse
- Docker-ready
- GET `/transactions` endpoint to view history


## How the Fraud Score Works

Each payment gets a risk score, from 0 (safe) to 1 (risky), based on these rules:

- **Big Amount:** If the amount is above 1,000, add 0.4.
- **Suspicious Email Domain:** If the email ends with `.ru` or `.test.com`, add 0.4.
- **Weird Domain:** If the domain is very short, has numbers, or ends with `.xyz`, add 0.2.
- **Random Base:** Every email+amount combo gets a small, consistent random score (up to 0.3).
- **Max Score:** Score never goes over 1.0.

**You get:**  
- The fraud score (number 0–1)  
- Reasons list (which rules triggered)

#### Example

For `user@scam.ru` paying $2,000:
- Big amount (+0.4), `.ru` domain (+0.4), maybe weird domain (+0.2), plus random (capped at 1.0)
- Reasons show each trigger

---

A Node.js + TypeScript Express API for secure payment routing, fraud detection, and explainable risk scoring.

---

## 🚀 Setup Instructions

1. **Clone the repository:**
   ```sh
   git clone <repo-url>
   cd secure-pay-router
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Configure environment:**
   - Copy `.env.example` to `.env` (or create `.env`):
     ```env
     PORT=3000
     GROQ_API_KEY=your-groq-key (optional, for LLM explanations)
     ```
4. **Build the project:**
   ```sh
   npm run build
   ```
5. **Start the server:**
   ```sh
   npm start
   ```
   Or for development with hot reload:
   ```sh
   npm run dev
   ```
6. **Run tests:**
   ```sh
   npm test
   ```

---

## 📚 API Endpoints

### `POST /charge`
- **Description:** Process a payment request, run fraud checks, route to a provider, and return a risk explanation.
- **Body:**
  ```json
  {
    "amount": 1000,
    "currency": "USD",
    "source": "tok_visa",
    "email": "user@example.com"
  }
  ```
- **Response:**
  ```json
  {
    "timestamp": "2024-07-17T12:34:56.789Z",
    "email": "user@example.com",
    "amount": 1000,
    "currency": "USD",
    "riskScore": 0.4,
    "provider": "stripe",
    "status": "success",
    "explanation": "Allowed. Risk factors: ...",
    "source": "tok_visa"
  }
  ```

### `GET /transactions`
- **Description:** Returns all processed transactions (in-memory store).
- **Response:** Array of transaction objects as above.

---

## 🧾 Example Payloads for `/charge`

Here are 50+ example payloads you can use to test the `/charge` endpoint:

```json
[
  { "amount": 10, "currency": "USD", "source": "tok_visa", "email": "alice@example.com" },
  { "amount": 2000, "currency": "USD", "source": "tok_mastercard", "email": "bob@site.ru" },
  { "amount": 500, "currency": "EUR", "source": "tok_amex", "email": "carol@test.com" },
  { "amount": 1500, "currency": "USD", "source": "tok_visa", "email": "dave@xyz.com" },
  { "amount": 100, "currency": "GBP", "source": "tok_paypal", "email": "eve@paypal.com" },
  { "amount": 50, "currency": "USD", "source": "tok_visa", "email": "frank@1234.com" },
  { "amount": 1200, "currency": "USD", "source": "tok_visa", "email": "grace@site.test.com" },
  { "amount": 999, "currency": "USD", "source": "tok_mastercard", "email": "heidi@short.co" },
  { "amount": 1001, "currency": "USD", "source": "tok_amex", "email": "ivan@site.ru" },
  { "amount": 300, "currency": "EUR", "source": "tok_paypal", "email": "judy@site.xyz" },
  { "amount": 2500, "currency": "USD", "source": "tok_visa", "email": "mallory@numbers123.com" },
  { "amount": 5, "currency": "USD", "source": "tok_visa", "email": "oscar@legit.com" },
  { "amount": 800, "currency": "USD", "source": "tok_mastercard", "email": "peggy@site.com" },
  { "amount": 1100, "currency": "USD", "source": "tok_amex", "email": "trent@site.ru" },
  { "amount": 100, "currency": "USD", "source": "tok_paypal", "email": "victor@xyz.com" },
  { "amount": 200, "currency": "USD", "source": "tok_visa", "email": "wendy@paypal.com" },
  { "amount": 3000, "currency": "USD", "source": "tok_visa", "email": "xavier@site.test.com" },
  { "amount": 400, "currency": "EUR", "source": "tok_mastercard", "email": "yvonne@short.co" },
  { "amount": 600, "currency": "USD", "source": "tok_amex", "email": "zach@site.ru" },
  { "amount": 700, "currency": "USD", "source": "tok_paypal", "email": "amy@site.xyz" },
  { "amount": 800, "currency": "USD", "source": "tok_visa", "email": "ben@numbers123.com" },
  { "amount": 900, "currency": "USD", "source": "tok_mastercard", "email": "chris@legit.com" },
  { "amount": 1000, "currency": "USD", "source": "tok_amex", "email": "dan@site.com" },
  { "amount": 1100, "currency": "USD", "source": "tok_paypal", "email": "ella@site.ru" },
  { "amount": 1200, "currency": "USD", "source": "tok_visa", "email": "fay@xyz.com" },
  { "amount": 1300, "currency": "USD", "source": "tok_mastercard", "email": "gina@paypal.com" },
  { "amount": 1400, "currency": "USD", "source": "tok_amex", "email": "hank@site.test.com" },
  { "amount": 1500, "currency": "USD", "source": "tok_paypal", "email": "irene@short.co" },
  { "amount": 1600, "currency": "USD", "source": "tok_visa", "email": "jack@site.ru" },
  { "amount": 1700, "currency": "USD", "source": "tok_mastercard", "email": "kate@site.xyz" },
  { "amount": 1800, "currency": "USD", "source": "tok_amex", "email": "leo@numbers123.com" },
  { "amount": 1900, "currency": "USD", "source": "tok_paypal", "email": "mia@legit.com" },
  { "amount": 2000, "currency": "USD", "source": "tok_visa", "email": "nick@site.com" },
  { "amount": 2100, "currency": "USD", "source": "tok_mastercard", "email": "olga@site.ru" },
  { "amount": 2200, "currency": "USD", "source": "tok_amex", "email": "paul@xyz.com" },
  { "amount": 2300, "currency": "USD", "source": "tok_paypal", "email": "quinn@paypal.com" },
  { "amount": 2400, "currency": "USD", "source": "tok_visa", "email": "ruth@site.test.com" },
  { "amount": 2500, "currency": "USD", "source": "tok_mastercard", "email": "sam@short.co" },
  { "amount": 2600, "currency": "USD", "source": "tok_amex", "email": "tina@site.ru" },
  { "amount": 2700, "currency": "USD", "source": "tok_paypal", "email": "uma@site.xyz" },
  { "amount": 2800, "currency": "USD", "source": "tok_visa", "email": "vince@numbers123.com" },
  { "amount": 2900, "currency": "USD", "source": "tok_mastercard", "email": "will@legit.com" },
  { "amount": 3000, "currency": "USD", "source": "tok_amex", "email": "xena@site.com" },
  { "amount": 3100, "currency": "USD", "source": "tok_paypal", "email": "yuri@site.ru" },
  { "amount": 3200, "currency": "USD", "source": "tok_visa", "email": "zane@xyz.com" },
  { "amount": 3300, "currency": "USD", "source": "tok_mastercard", "email": "abby@paypal.com" },
  { "amount": 3400, "currency": "USD", "source": "tok_amex", "email": "brian@site.test.com" },
  { "amount": 3500, "currency": "USD", "source": "tok_paypal", "email": "claire@short.co" }
]
```

---

## 🕵️‍♂️ Fraud Rules Explanation
Fraud score is calculated using these heuristics:
- **+0.4** if `amount > 1000`
- **+0.4** if email domain is `.ru`, `.test.com`, or looks suspicious (numbers, `.xyz`, or very short)
- **+0.2** if domain contains numbers, ends with `.xyz`, or is very short
- **+random (0–0.3)** base score for unpredictability
- **Score is clamped to 1.0 max**
- **Routing:**
  - If score >= 0.5: payment is `blocked`
  - If score < 0.5: randomly routed to `stripe` or `paypal`

---

## 🤖 LLM Usage (GROQ)
- If `GROQ_API_KEY` is set, the API will use [Groq LLM](https://groq.com/) (Llama-4) to generate a natural-language explanation for the risk decision.
- If not, a simulated explanation is generated based on the fraud reasons.
- The model used is `meta-llama/llama-4-scout-17b-16e-instruct` via the Groq API.

---

## 📝 Assumptions
- All data is stored in-memory (no database).
- The `/charge` endpoint is for demonstration/testing only (no real payment processing).
- LLM integration is optional and falls back to a simulated explanation if no API key is provided.
- The API is not production-hardened (no rate limiting, auth, etc.).
- Docker support is included, but Docker is not required to run locally.

---

## 🧪 Testing
- Run `npm test` to execute all unit and API tests and see coverage.

---

## 📂 Project Structure
- `src/controllers` – Route handlers
- `src/routes` – Express routes
- `src/services` – Business logic (fraud, routing, LLM)
- `src/data` – In-memory storage
- `src/models` – TypeScript types
- `src/middlewares` – Validation and other middleware

---

Feel free to reach out for questions or improvements! 