<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

![Profile views](https://gpvc.arturio.dev/aqulasoftTgWarden)
[![Open Source? Yes!](https://badgen.net/badge/Open%20Source%20%3F/Yes%21/blue?icon=github)](https://github.com/aqulasoft/telegramwarden/)
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![[Telegram] aqulasoft live][telegram-shield]][telegram-url]

[![Pulls](https://shields.beevelop.com/docker/pulls/aqulasoft/twarden.svg?style=flat-square)](https://hub.docker.com/repository/docker/aqulasoft/twarden)
[![Layers](https://shields.beevelop.com/docker/image/layers/aqulasoft/twarden/latest.svg?style=flat-square)](https://hub.docker.com/repository/docker/aqulasoft/twarden)
[![Size](https://shields.beevelop.com/docker/image/image-size/aqulasoft/twarden/latest.svg?style=flat-square)](https://hub.docker.com/repository/docker/aqulasoft/twarden)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/aqulasoft/telegramwarden.svg
[contributors-url]: https://github.com/aqulasoft/telegramwarden/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/aqulasoft/telegramwarden.svg
[forks-url]: https://github.com/aqulasoft/telegramwarden/network/members
[stars-shield]: https://img.shields.io/github/stars/aqulasoft/telegramwarden.svg
[stars-url]: https://github.com/aqulasoft/telegramwarden/stargazers
[issues-shield]: https://img.shields.io/github/issues/aqulasoft/telegramwarden.svg
[issues-url]: https://github.com/aqulasoft/telegramwarden/issues
[license-shield]: https://img.shields.io/github/license/aqulasoft/telegramwarden.svg
[license-url]: https://github.com/aqulasoft/telegramwarden/blob/master/LICENSE.txt
[telegram-shield]: https://img.shields.io/badge/telegram-aqulasoft-blue.svg
[telegram-url]: https://t.me/aqulasoft

# TelegramWarden

### [TelegramWarden Docker Hub](https://hub.docker.com/repository/docker/aqulasoft/twarden)

## Run manually

```bash
docker run --restart always -d --name twarden -p \
    -e BOT_TOKEN='<BOT_TOKEN>' \
    -e DB_CONNECTION='<driver>' \
    -e DB_HOST='<host>' \
    -e DB_PORT='<port>' \
    -e DB_USERNAME='<username>' \
    -e DB_PASSWORD='<pass>' \
    -e DB_DATABASE='<dbname>' \
    -e DB_SYNCHRONIZE=false \
    -e DB_LOGGING=true \
    aqulasoft/twarden
```

## Configuration

- `BOT_TOKEN`: Telegram bot token
- `TO_TRANSLATE`: ISO 639-1 Language code used for auto message translate (Default: en)
- `MAX_MSG_LENGTH`: Message max length (Default: 1000)
- `DENY_URL`: Delete messages with links (Default: true)
- `DENY_PHOTO`: Delete messages with photo (Default: true)
- `DB_CONNECTION`: postgres
- `DB_HOST`= Database Host
- `DB_PORT`= Database Port
- `DB_USERNAME`= Database username
- `DB_PASSWORD`= Database password
- `DB_DATABASE`= Database name
- `DB_SYNCHRONIZE`= Sync Database on start (Boolean)
- `DB_LOGGING`= Database logging (Boolean)
