## Install Sources

> DEVELOPMENT NOTES

We need a way to specify git paths which will fail if they are straight URL's piped through _axios_.

In our configuration which we can store in a couple of places and merge together!

```
{
  sources: {
    'git@repo': 'https://<username>@repo.advisory.com/scm/eabui/<group>.git',
    'file@local': '~/folder/<group>/<file>',
    'web@phoenix': 'http://phoenix.eab.com/<group>/<file>'
  }
}
```

// source/group/file
`bauble install repo/data-ng-academic-planner/core-ply-brand_3.8.0`

// source/file
`bauble install repo/core-ply-brand_3.8.0`

// web because of http(s) and zip/tar
`bauble install http://phoenix.eab.com/projects/core-ply-brand_3.8.0.zip`

// file because of no http(s) and zip/tar
`bauble install http://phoenix.eab.com/projects/core-ply-brand_3.8.0.zip`

