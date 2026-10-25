---
title: Access tokens
description: Read and write a SharePoint, OneDrive or Google Drive folder with the provider's own SDK, using a short-lived token Toft hands your app.
---

When an administrator has turned on **Let apps get access tokens** on the
SharePoint, OneDrive or Google Drive connection attached to your app, your app can
get that connection's own access token and call Microsoft Graph or the Drive API
directly: list, read, replace and delete files. Your app never holds a secret.

```python
token = toft.access_token("sharepoint")
token.value                  # the bearer token
token.expires_at             # when it stops working
token.folder.drive_id        # the folder your app was attached to,
token.folder.item_id         # in Graph's own ids
```
```js
const token = await toft.accessToken("sharepoint");
```
```go
token, err := toft.AccessToken(ctx, "sharepoint")
```
```r
token <- access_token("sharepoint")
```

The kind is `sharepoint`, `onedrive` or `gdrive`. Each SDK keeps the token and
fetches a new one five minutes before it expires, so you can call it before every
request.

## With Microsoft's libraries

Python and Node have an adapter that Microsoft's libraries accept as a credential:

```python
from msgraph import GraphServiceClient

client = GraphServiceClient(toft.azure_credential("sharepoint"))
```
```js
import { Client } from "@microsoft/microsoft-graph-client";
import { TokenCredentialAuthenticationProvider } from
  "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials/index.js";

const client = Client.initWithMiddleware({
  authProvider: new TokenCredentialAuthenticationProvider(
    toft.azureCredential("sharepoint"), { scopes: [] }),
});
```

In Go, wrap it in five lines of your own:

```go
type toftCredential struct{ kind string }

func (c toftCredential) GetToken(ctx context.Context, _ policy.TokenRequestOptions) (azcore.AccessToken, error) {
	t, err := toft.AccessToken(ctx, c.kind)
	return azcore.AccessToken{Token: t.Value, ExpiresOn: t.ExpiresAt}, err
}
```

In R, pass `token$value` to `httr2::req_auth_bearer_token()`.

## Without a library

```python
import requests

t = toft.access_token("sharepoint")
h = {"Authorization": f"Bearer {t.value}"}
base = f"https://graph.microsoft.com/v1.0/drives/{t.folder.drive_id}/items/{t.folder.item_id}"

for item in requests.get(f"{base}/children", headers=h).json()["value"]:
    print(item["name"])

requests.put(f"{base}:/output.csv:/content", headers=h, data=b"a,b\n1,2\n").raise_for_status()
```

For Google Drive, `google.oauth2.credentials.Credentials(t.value)` works with
Google's client library, and `t.folder.item_id` is the folder's id.

## What to know

- **The folder is a hint, not a limit.** The token reaches everything the
  connection was granted on Microsoft's or Google's side. For a whole-site grant,
  that is the whole site. Use the folder to know where to work.
- **Ask first.** `toft.app.can("sharepoint.token")` is true only while the
  connection hands out tokens.
- **Refusals.** `403 sharepoint_tokens_off` means the switch is off. `409
  token_too_wide` means the connection's Entra app holds permissions beyond files,
  such as sending mail, and Toft won't hand that token to an app.
- **A token works for about an hour**, even if your app is detached in the
  meantime. Never log it; the SDKs leave it out when a token is printed.
- **Jobs** can get a token too, while their run is in flight.
- Each token request is recorded in the app's integration log, without the token.
  What your app then reads or writes is recorded by Microsoft or Google, not Toft.
