cc.game.onStart = function () {
    cc.LoaderScene.preload(["img/icons.plist"], function () {
        cc.director.runScene(new simpleScene());
    }, this);
};

cc.game.run("canvas");