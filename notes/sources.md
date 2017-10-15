## Install Sources

> DEVELOPMENT NOTES

We need a way to specify git paths which will fail if they are straight URL's piped through _axios_.

In our configuration which we can store in a couple of places and merge together!

node bin/index.js cache --audit ../bower-alternative-source-resolver.zip 1.2.3

```
{
  sources: {
    '@repo': {
      reference: 'https://${username}@repo.advisory.com/scm/eabui/${group}.git ${resource}.zip',
      service: 'git',
      username: `sadf`,
      password: `sdf`
    },
    '@local': {
      reference: '~/folder/<group>/<file>',
      service: 'local'
    },
    '@phoenix': {
      reference: 'http://phoenix.eab.com/<group>/<file>',
      service: 'web'
    }
  }
}
```

// 1. zip

local + zip       (DONE)
web + zip         (DONE)

// 2. git folder (entire repo)

git + folder      (DONE)

// 3. git folder of zips

git + folder/zip  (----)

// 4. tar

git + folder/tar
local + tar
web + tar

node bin/index.js cache ../bower-alternative-source-resolver.zip #1.2.3
node bin/index.js cache http://phoenix.eab.com/projects/core-ply-brand_3.8.0.zip #1.2.3
node bin/index.js cache https://JaworskM@repo.advisory.com/scm/~jaworskm/test-test.git #1.2.3 core-ply-brand_3.8.0.zip

node bin/index.js cache @f1/bower-alternative-source-resolver #1.2.3
node bin/index.js cache @phoenix/core-ply-brand_3.8.0 #1.2.3
node bin/index.js cache @repo/biz-ng-career-details/core-ply-brand_3.8.0 #1.2.3

node bin/index.js cache https://JaworskM@repo.advisory.com/scm/~jaworskm/test-test.git core-ply-brand_3.8.0.zip

<!-- node bin/index.js audit -r http://phoenix.eab.com/projects/core-ply-brand_3.8.0.zip -->

<!--
// source/group/file
`bauble install repo/data-ng-academic-planner/core-ply-brand_3.8.0`

// source/file
`bauble install repo/core-ply-brand_3.8.0`

// web because of http(s) and zip/tar
`bauble install http://phoenix.eab.com/projects/core-ply-brand_3.8.0.zip`

// file because of no http(s) and zip/tar
`bauble install http://phoenix.eab.com/projects/core-ply-brand_3.8.0.zip`
-->

node bin/index.js cache --audit http://phoenix.eab.com/projects/core-ply-brand_3.8.0.zip

node bin/index.js cache http://phoenix.eab.com/projects/core-ply-brand_3.8.0.zip


A. web + zip           http://a.b.c/file.zip 1.2.3
B. git + folder/zip    http://a.b.c/file.git folder/file.zip 1.2.3
C. git + folder        http://a.b.c/file.git 1.2.3
D. local + folder/zip  a/b/c/ folder/file.zip 1.2.3
E. local + zip         a/b/c/folder/file.zip 1.2.3
F. local + folder      a/b/c/ 1.2.3

A. node bin/index.js cache --audit http://phoenix.eab.com/projects/core-ply-brand_3.8.0.zip 1.2.3
B. node bin/index.js cache --audit https://repo.advisory.com/scm/~jaworskm/test-test.git core-ply-brand_3.8.0.zip 1.2.3
C. node bin/index.js cache --audit https://repo.advisory.com/scm/~jaworskm/test-test.git 1.2.3
D. node bin/index.js cache --audit ../ bower-alternative-source-resolver.zip 1.2.3
E. node bin/index.js cache --audit ../bower-alternative-source-resolver.zip 1.2.3
F. node bin/index.js cache --audit ../test  1.2.3

A. cache (zip)          staging (folder)    component (folder-refined)    DONE
B. cache (folder/zip)   staging (folder)    component (folder-refined)    ----
C. cache (folder)       staging (folder)    component (folder-refined)    ----
D. cache (folder/zip)   staging (folder)    component (folder-refined)    DONE
E. cache (zip)          staging (folder)    component (folder-refined)    DONE
F. cache (folder)       staging (folder)    component (folder-refined)    DONE

node bin/index.js cache --audit ../folder_a/ xew.zip

node bin/index.js cache

node bin/index.js cache  https://github.com/advisory/phoenix/blob/master/ui-ply-input_3.8.0.zip?raw=true
