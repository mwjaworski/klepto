## Install Sources

> DEVELOPMENT NOTES

We need a way to specify git paths which will fail if they are straight URL's piped through _axios_.

In our configuration which we can store in a couple of places and merge together!

node bin/index.js download --audit ../bower-alternative-source-resolver.zip 1.2.3

```json
{
  sources: {
    "repo": {
      "pattern": "source/group/resource",
      "pull_uri": "https://${username}@repo.advisory.com/scm/eabui/${group}.git ${resource}.zip",
      "constants": {
        "username": "jaworskm"
      }
    },
    "local": {
      "pattern": "${source}/${group}/${sub_group}/${resource}",
      "pull_uri": "~/folder/${group}/${sub_group}/${resource}"
    },
    "phoenix": {
      "pattern": "${source}/${group}/${resource}",
      "pull_uri": "http://phoenix.eab.com/${group}/${resource}.zip"
    }
  }
}
```

// 1. zip

local + zip       (DONE)    NO
web + zip         (DONE)

// 2. git folder (entire repo)

git + folder      (DONE)    NO

// 3. git folder of zips

git + folder/zip  (----)    NO

// 4. tar

git + folder/tar
local + tar
web + tar

node bin/index.js download https://github.com/mwjaworski/configula.git --addendum

node bin/index.js download ../bower-alternative-source-resolver.zip #1.2.3
node bin/index.js download http://phoenix.eab.com/projects/core-ply-brand_3.8.0.zip #1.2.3
node bin/index.js download https://JaworskM@repo.advisory.com/scm/~jaworskm/test-test.git #1.2.3 core-ply-brand_3.8.0.zip

node bin/index.js download @f1/bower-alternative-source-resolver #1.2.3
node bin/index.js download @phoenix/core-ply-brand_3.8.0 #1.2.3
node bin/index.js download @repo/biz-ng-career-details/core-ply-brand_3.8.0 #1.2.3

node bin/index.js download https://JaworskM@repo.advisory.com/scm/~jaworskm/test-test.git core-ply-brand_3.8.0.zip

<!-- node bin/index.js audit -r http://phoenix.eab.com/projects/core-ply-brand_3.8.0.zip -->

<!--
// source/group/file
`klepto install repo/data-ng-academic-planner/core-ply-brand_3.8.0`

// source/file
`klepto install repo/core-ply-brand_3.8.0`

// web because of http(s) and zip/tar
`klepto install http://phoenix.eab.com/projects/core-ply-brand_3.8.0.zip`

// file because of no http(s) and zip/tar
`klepto install http://phoenix.eab.com/projects/core-ply-brand_3.8.0.zip`
-->

node bin/index.js download --audit http://phoenix.eab.com/projects/core-ply-brand_3.8.0.zip

node bin/index.js download http://phoenix.eab.com/projects/core-ply-brand_3.8.0.zip


A. web + zip           http://a.b.c/file.zip 1.2.3                    YES
B. git + folder/zip    http://a.b.c/file.git folder/file.zip 1.2.3    NO
C. git + folder        http://a.b.c/file.git 1.2.3                    NO
D. local + folder/zip  a/b/c/ folder/file.zip 1.2.3                   NO
E. local + zip         a/b/c/folder/file.zip 1.2.3                    YES
F. local + folder      a/b/c/ 1.2.3                                   YES

node bin/index.js download ../link-talk@1.2.3
node bin/index.js install ../link-talk@1.2.3

node bin/index.js download ../bower-alternative-source-resolver.zip
node bin/index.js download ../my-tarball.tgz

node bin/index.js download http://phoenix.eab.com/projects/core-ply-brand_3.8.0.zip@1.2.3

node bin/index.js download https://JaworskM@repo.advisory.com/scm/eabui/capability-ng-favorites.git --audit

node bin/index.js install https://repo.advisory.com/scm/eabui/capability-ng-favorites.git@1.2.3

A. node bin/index.js download  http://phoenix.eab.com/projects/core-ply-brand_3.8.0.zip@1.2.3
B. node bin/index.js download  https://repo.advisory.com/scm/~jaworskm/test-test.git#1.2.3 core-ply-brand_3.8.0.zip
C. node bin/index.js download  https://repo.advisory.com/scm/~jaworskm/test-test.git 1.2.3
D. node bin/index.js download  ../ bower-alternative-source-resolver.zip 1.2.3
E. node bin/index.js download  ../bower-alternative-source-resolver.zip@1.2.3
F. node bin/index.js download  ../test@S1.2.3

A. download (zip)          staging (folder)    component (folder-refined)    DONE
B. download (folder/zip)   staging (folder)    component (folder-refined)    ----
C. download (folder)       staging (folder)    component (folder-refined)    ----
D. download (folder/zip)   staging (folder)    component (folder-refined)    DONE
E. download (zip)          staging (folder)    component (folder-refined)    DONE
F. download (folder)       staging (folder)    component (folder-refined)    DONE

## Detect Version

1. download zip
2. unzip to staging
3. copy to vault

where can I check version and compare against existing?

A. download (web + zip)            on a vault-manifest.json hosted at the site
B. download (git + folder/zip)     other files with the version stripped out
C. download (git + folder)         use git versioning (to see tags)
D. download (local + folder/zip)   other files with the version stripped out
E. download (local + zip)          other files with the version stripped out
F. download (local + folder)       other folders with the version stripped out

1. (A) download a vault-manifest.json (PENDING)
2. (B, D, E, F*) tear version off of file/folder and scan
3. (C) ask git for a tag list and review

1. we pull remote
2. we have to scan the download/
3. we have to scan the download/

```bash
node bin/index.js install  ../folder_a/ xew.zip
node bin/index.js download  ../link-talk
node bin/index.js download
node bin/index.js download  https://github.com/advisory/phoenix/blob/master/ui-ply-input_3.8.0.zip?raw=true
https://github.com/advisory/phoenix/ ui-ply-input_3.8.0.zip
klepto download https://github.com/advisory/phoenix.git ui-ply-input_3.8.0.zip
klepto install https://github.com/advisory/phoenix.git ui-ply-input_3.8.0.zip
```


```
{
  "core-sass-brand-v3": "core-sass-brand#3.0.0"
}

or

klepto install core-sass-brand#3.0.0 --rename core-sass-brand-v3
```
