const fs = require('fs-extra')
fs.writeFileSync(
	'./.env',
	`REACT_APP_CLIENT_ID=${process.env.REACT_APP_CLIENT_ID}\n`
)
