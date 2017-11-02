Options

1. download ui-ply-icon__3.8.0.zip
2. download ui-ply-icon.zip@3.8.0
3. download ui-sass-icon@3.1.0
4. download ../library/ui-ng-dropdown@4.3.2
5. download components/3.8.0/ui-ply-icon.zip

1. download to cache as ui-ply-icon__3.8.0 and copy to staging as the same?! but it should be installed as ui-ply-icon?!
2.


5. we can download and the naming is better, but we will install all of them in the same folder one over the other...

So...

we install to cache

1. ZIP -> component__version
2. FOLDER -> component
3. GIT -> component

we install the same to staging so they are opened up..., but ZIP is an issue because we cannot iterate over it...

SO - Transit owns getting the versions

1. ZIP -> component____version/
2. FOLDER -> component/
3. GIT -> component/

Then we send where to copy to staging... which mirrors this...

All are installed - so then we have to iterate over them () and if we find ____
we pull off the version (so we have a flat list)

So we have to change the file when we save if it is ZIP or TAR

Then - we can build the dependency group


// ISSUE if we install ui-sass-whatever__3.2.1.zip then the folder will be ui-sass-whatever__3.2.1 (so... only one version... how do we handle knowing it is not a name but name and version - then we have to pull them all down anyways)
