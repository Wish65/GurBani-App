# Nitnem — BaniDB Online Reader

This version uses **BaniDB only** for all Gurbani content. It does not call ShabadOS or any other Gurbani source.

## Run
Host this folder on a static HTTPS web host, or locally:
```bash
python -m http.server 8000
```
Open `http://localhost:8000`.

## Included
- Time-based suggested Bani on Today
- 21-item Nitnem library in the requested order
- Bani reader with font-size, translation visibility and Larivaar controls
- Random Shabad reflection using BaniDB's documented `/random/{sourceID}` endpoint
- Dynamic Bani ID lookup from BaniDB's `/banis` catalogue (no guessed sequential IDs)
- Dark mode preference saved locally
- Responsive mobile layout

## Data and network
The app requests content from `https://api.banidb.com/v2`. Internet access is required. Bani catalogue IDs are resolved from the live BaniDB response at runtime. If a Bani title cannot be matched or an API response cannot be parsed, the app displays an error rather than substituting or fabricating Gurbani.

BaniDB API documentation: https://github.com/KhalisFoundation/banidb-api/blob/dev/swagger.json
BaniDB project: https://www.banidb.com/

## Attribution and terms
Data source: BaniDB / Khalis Foundation. Review BaniDB's current terms before public deployment: https://www.banidb.com/tos/
