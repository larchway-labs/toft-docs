---
title: App storage
description: What a storage resource is, the two kinds, where the bytes can live, and how apps and people reach one.
---

App storage gives apps durable files: a database file, uploads, datasets,
reports. You manage it in **Admin → Storage**.

## How it fits together

You create a **resource**: a directory on a file system, or a prefix in a
bucket, that already exists. Toft never creates the file system or the bucket.
Then you decide who reaches it:

| Who | How you give it | What they get |
|---|---|---|
| **An app** | **Attach** it, in the resource's *Apps* section | A path inside the app. No credential |
| **A person** | **Grant** it, in the resource's *People* section | The storage browser and `toft store` |
| **Someone you trust to attach it** | Make them a **delegate** | They attach it to apps they can edit, up to a level you set |

Each attachment and each grant has a **level** and can be limited to a
**folder**. That is the whole model. Everything below is a detail of one of
those parts.

## Name it

A resource's **name** is what everyone types: apps look it up with
`toft.storage("sales-data")` and people use `toft store ls sales-data`. So it
has a fixed format:

- 3 to 40 characters: lowercase letters, digits and hyphens
- starts with a letter, no double hyphen, doesn't end with a hyphen
- **can't be changed after it's created**, because apps' code is written with it

`sales-data`, `model-weights` and `team-share` work; `Sales data`, `sales_data`
and `2026-data` don't. Put the plain-English explanation (what it's for, who owns
it) in the **description**, which you can edit at any time.

Each resource's page shows **Where it lives** (the mount and real directory, or
the bucket, prefix and URI, or the storage class and claim) and **Use it**: the
exact `toft store` commands and app code for that resource, in Python, Node, R
and Go.

An app's attachment and a person's grant are separate. Granting yourself a
folder doesn't let an app read it, and attaching a resource to an app doesn't
let you browse it.

## Choose a kind

The kind is what app code experiences, and it is the one choice that changes
how an app has to be written.

| | **Volume** | **Object store** |
|---|---|---|
| What it is | A real file system | A prefix in a bucket |
| Files can be | Appended to, renamed, locked | Read and written whole only |
| Use it for | SQLite and DuckDB, caches, working files | Datasets, model weights, exports, reports |
| People can browse it | Depends on where it lives (below) | Yes |

If you're not sure, ask whether an app will keep a database file in it. If yes,
it's a volume.

## Where the bytes live

The form offers only what this install is set up for, and when there is one
option it just says what it is. Whoever deployed Toft decides what's on offer.

| Option on the form | Kind | Offered when | People can browse it |
|---|---|---|---|
| **EFS** | Volume | A cluster whose `KUBE_STORAGE_CLASS` is an EFS class | No |
| **Azure Files** | Volume | A cluster whose `KUBE_STORAGE_CLASS` is an Azure Files class | No |
| **Amazon S3 Files** | Volume | A cluster with `KUBE_S3FILES_STORAGE_CLASS`, or a host with `SHARED_STORAGE_ROOTS` and `STORE_UPLOADS` for S3 | Yes |
| **Host mount** | Volume | A host with `SHARED_STORAGE_ROOTS` | Yes, with Toft carrying the files |
| **S3** | Object store | A cluster with `KUBE_STORE_CSI_DRIVER`, or any install with `STORE_UPLOADS` | Yes |
| **Azure Blob** | Object store | A cluster with `STORE_ACCOUNT`, or any install with `STORE_UPLOADS` and `STORE_BACKEND=azblob` | Yes |

- **EFS and Azure Files share one setting.** Toft reads the storage class to see
  which one it is and offers that. If it can't tell, it offers both; pick the
  one your cloud provides.
- **On Azure Files, use NFS 4.1** if an app keeps SQLite or DuckDB there. SMB
  can corrupt them, and Toft can't see which protocol a share uses.
- **Amazon S3 Files asks for the bucket behind the file system**, which is what
  lets people browse it. Toft can't check it, and a wrong bucket lists the wrong
  files.
- **A bucket always comes with a prefix.** Apps and people see only what is under
  it. A bucket root is refused.
- **People reaching a bucket** also need `STORE_UPLOADS` and CORS on the bucket
  (see [Things to know](#things-to-know)). People reaching a host mount need
  every app on its own account (`APP_USER_PER_APP`) and the host's
  `fs.protected_hardlinks` set to 1. The **Storage** check says which is missing.

## Drives

A **drive** is a place volumes can live: a directory declared in
`SHARED_STORAGE_ROOTS` on a host install, or a storage class on a cluster. Whoever
runs Toft declares the drives; **Admin → Storage → Drives** lists them with how
many resources each holds.

- **Give a drive a label.** *Edit label…* sets what everyone sees, like
  "Order management" for a root declared as `efs`, plus an optional description.
  Nothing restarts, and apps and the CLI aren't affected: they use resource
  names, never drive names. Clear the label to show the drive's own name again.
- **More than one drive?** The create form asks which one a new volume goes on.
  On a cluster, list extra classes in `KUBE_STORAGE_CLASSES` as
  `name[=backing]`, for example `ord-efs,ord-s3=s3files`. S3 Files classes must
  say `=s3files`, because they use the same driver as EFS.
- **If a drive's declared name changes**, the resources on it are stranded: the
  page shows a notice and the drive as *No longer declared*, and their apps won't
  start. Use *Re-point…* to move them to the drive that now holds their files. It
  first checks every resource: on a host, that its directory exists on the new
  drive; on a cluster, that its volumes are on the new class's EFS file system.
  If any check fails, nothing moves. It never copies data. Azure Files drives
  can't be re-pointed.

## Levels

A level is how a resource is attached to an app, not a permission app code asks
for. A resource attached read only can't be written to, whatever the code does.

**What an app can be given:**

| Kind | Levels |
|---|---|
| Volume | **Read only** · **Read & write** |
| Object store | **Read only** · **Can add** · **Read & write** |
| Object store on Azure Blob | **Read only** · **Read & write** |

**What a person can be given**, on any resource people can browse, volumes
included:

| Level | They can | In the API and CLI |
|---|---|---|
| **Read only** | List and download | `read` |
| **Can add** | Also upload new files. Replacing one is refused | `write` |
| **Read & write** | Also replace and delete | `full` |

- Each level includes the ones above it.
- **Can add** is the safe default for a dataset an app or a person contributes
  to: nothing already there can be changed.
- **Azure Blob can't be attached at Can add.** Its driver mounts read-only or
  read-write, nothing between, so Can add is refused when you attach. It still
  works for people.
- **Can replace was merged into Read & write.** It stopped a name being deleted
  but not its contents being replaced, so it protected nothing. On upgrading,
  anything at Can replace moved to Read & write, with one entry per change on
  Admin → Activity. Set one back to Can add if it should only add.
- Within a volume, people granted **Can add** can only add, even though an app
  attached to the same volume at **Read & write** can change anything.
- A resource under a read-only host mount (`:ro`) is **Read only** for everyone.

## Folders

An attachment or a grant can name a folder, and then that folder is all it
reaches. The app or person can't see the folders beside it.

- **One app can attach one resource twice**, at two folders and two levels: for
  example the root **Read only** and a `drop` folder **Can add**. App code then
  names the folder to pick one.
- **Two grants to one person add up.** A grant on `reports` and a grant on
  `reports/2026` give the wider of the two inside `reports/2026`. To narrow
  somebody, edit their wider grant.
- Someone with no grant on the root sees only the folders they hold, never an
  empty store.

### Partitioned resources

Create a resource as **Partitioned** to give out one share by folder. Each app
is attached to a folder, never the whole resource. Apps on the same folder share
it and can edit each other's files, and no other app can open it. A folder can't
sit inside another attached folder, so `teams` is refused while `teams/sales` is
attached.

Partitioned is fixed when the resource is created. Under a host mount it needs
every app to run on its own account (`APP_USER_PER_APP`), and the form doesn't
offer it otherwise.

## Delegates

By default only administrators attach storage. Make someone a **delegate** of a
resource, with a top level, and they can attach it to any app they can edit, at
that level or below. Delegating an object store also lets them browse it at
that level.

Each attachment records who made it. Removing a delegate removes the
attachments they made, and **restarts the apps that had them**. It is the one
permission change in Toft that restarts a running app.

## When changes take effect

- **Attaching or detaching takes effect when the app next deploys or
  restarts**, never under a running app.
- **Grants take effect at once.**
- **A name never changes.** To fix a wrong one, create a new resource, move the
  attachments and delete the old one. **Edit description…** is the only edit.
- **A drive label changes at once**, and only on these pages.

## Without a cluster

On an install that runs apps as processes on one host, Toft mounts nothing. You
mount the file system yourself and declare it:

```bash
SHARED_STORAGE_ROOTS=reports=/srv/toft/reports,archive=/srv/toft/archive:ro
```

Each root is a place volumes can be created. A resource is a directory under
it, and only apps attached to that resource can open it. Toft creates that
directory itself and deletes it with the resource, so a name whose directory
already exists on the root is refused: choose another name, or move the
directory aside first. If you declare one root, the form uses it without asking. The **Storage** check fails when a
root's mount is gone or has turned read-only.

**Object stores work without a cluster too**, but they are never mounted. Set
`STORE_UPLOADS=1` and give Toft's credential access to the bucket, and
*Object store* appears as a kind. Attached apps reach it through the SDK's
`upload`, `download`, `url`, `remove` and `list` calls, at the attachment's
level. The path you give an attachment is used only if the app later runs on a
cluster.

**People reaching a volume under a root** use `toft store` and the storage
browser, with Toft carrying the files. What they upload belongs to the apps on
that folder, so those apps can edit and delete it. On a partitioned resource an
upload goes into an attached folder, never beside one — and the same is true of a
partitioned store on a bucket. Until you attach a folder, a partitioned resource
takes no uploads at all, and `toft store ls` tells people so.

An app with a volume attached **fails to deploy** on a host that declares no
roots, rather than writing into a folder the next deploy throws away.

## Limits

An install holds at most **25** storage resources, and an app at most **5**
attachments. Folders of a partitioned resource don't count against the 25, so
one partitioned share is the way to give many apps their own folder.

## Things to know

| | |
|---|---|
| Browser uploads | Need **CORS on the bucket**. Without it the browser fails the upload and Toft never sees it |
| Audit | Records each upload or download link Toft issues. On a host mount, also the file arriving |
| Administrators | **Have no automatic access** to a resource's files. Grant yourself if you need to look; it is audited |
| Deleting an app | Detaches its storage. **The data is kept** |
| Deleting a resource | Refused while any app uses it. Otherwise it **deletes every file in it**, after you type its name, wherever the drive can: a host mount always, a cluster drive when its storage driver is set up to remove files (the delete dialog tells you which). Where it can't, the files stay and Toft says where |
| A name just deleted on a cluster | Stays reserved until the cluster has finished removing the files, usually minutes and at most an hour. Admin → Storage lists it under **Being deleted**, and creating a resource with that name is refused until then |
| Object stores | Deleting one never deletes anything in the bucket |
