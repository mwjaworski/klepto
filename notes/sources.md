## Install Sources

> DEVELOPMENT NOTES

We need a way to specify git paths which will fail if they are straight URL's piped through _axios_.

In our configuration which we can store in a couple of places and merge together!

```
{
  sources: {
    'repo': {
      locator: 'https://<username>@repo.advisory.com/scm/eabui/<group>.git',
      service: 'git',
      username: `sadf`,
      password: `sdf`
    },
    'local': {
      locator: '~/folder/<group>/<file>',
      service: 'local'
    },
    'phoenix': {
      locator: 'http://phoenix.eab.com/<group>/<file>',
      service: 'web'
    }
  }
}
```

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
