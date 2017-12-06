## Example Slack bot using Taskworld's API
This is an example application to show how [Taskworld's](https://api.taskworld.com) API can be used with slack to create a bot for creating tasks. 
A demonstration video of the final bot can be found on XXXXXX

## Requirements
- A slack app setup in your workspace
- A slash command setup in your workspace
- A tunnel to localhost from your slash command using ngrok, serveo etc for development. For more info on how to setup ngrok for slack visit [Using ngrok to develop locally for Slack](https://api.slack.com/tutorials/tunneling-with-ngrok)



## Environment Variables
An example .env file can be found under .env.sample

- `CLIENT_ID` - Slack client ID
- `CLIENT_SECRET` - Slack client secret
- `VERIFICATION_TOKEN` - verification token from Slack
- `PORT` - port for development
- `ACCESS_TOKEN` - access token from [Taskworld API](https://api.taskworld.com)
- `SPACE_ID` - ID of your workspace on taskworld. Can be fetched from [Taskworld API](https://api.taskworld.com)
- `PROJECT_ID`- ID of the project you want to create tasks. Can be fetched from [Taskworld API](https://api.taskworld.com)
- `LIST_ID` - ID of the tasklist you want to create tasks. Can be fetched from [Taskworld API](https://api.taskworld.com)


## Quick Start Guide
1. Setup environment variables (See .env.sample).
2. Setup your slack bot.
3. Setup your slash commands to call the `/twctask` route.
4. Setup your interactive commands to call the `/actions` route.
3. Setup a tunnel from your localhost to your slack bot slash commands.
4. yarn && yarn start
5. In your channel setup with your slack bot, try `/twctask hello world` and a task should be created.

For further information, please visit: 
- [Slack API](https://api.slack.com/)
- [Taskworld API](https://api.taskworld.com/)