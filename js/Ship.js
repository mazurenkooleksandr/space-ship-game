Ship = function(_simpleScene) {
    const SHIP_POSITIONS = {
        0: {x: 1489, y: 286},
        1: {x: 1325, y: 319},
        2: {x: 1204, y: 272},
        3: {x: 1151, y: 422},
        4: {x: 1009, y: 444},
        5: {x: 1262, y: 505},
        6: {x: 1417, y: 477},
        7: {x: 1567, y: 582},
        8: {x: 1373, y: 689},
        9: {x: 1179, y: 642},
        10: {x: 1230, y: 833},
        11: {x: 1408, y: 814},
        12: {x: 1487, y: 940},
        13: {x: 1327, y: 962},
    };
    const SHIP_ROTATION = [-80, -80, -125, -20, -80, 70, 100, 60, -60, -110, 10, 90, 30, -90];
    const SHIP_ROTATION_BACK = [100, 55, 165, 95, -105, -85, -130, 120, 80, -160, -90, -150, -90];
    var _currentStep = 0;
    var _spaceShip = null;
    var _spaceShipLaunch = null;
    function init () {
        _spaceShip = cc.Sprite.create("img/ship.png");
        _spaceShipLaunch = cc.Sprite.create("img/launch-ship.png");
        _spaceShip.setPosition(SHIP_POSITIONS[0]);
        _spaceShipLaunch.setPosition(SHIP_POSITIONS[0]);
        _spaceShip.setScale(0.3);
        _spaceShipLaunch.setScale(0.3);
        _spaceShip.setRotation(SHIP_ROTATION[0]);
        _spaceShipLaunch.setRotation(SHIP_ROTATION[0]);
        _simpleScene.addChild(_spaceShip);
        _simpleScene.addChild(_spaceShipLaunch);
        _spaceShip.setVisible(true);
        _spaceShipLaunch.setVisible(false);
        _currentStep = 0;
    }
    this.udateState = function(_win) {
        _win ? _currentStep++ : _currentStep--;
        if (_currentStep < 0) {
            _currentStep = 0;
        } 
        _spaceShip.setRotation(SHIP_ROTATION[_currentStep]);
        _spaceShipLaunch.setRotation(SHIP_ROTATION[_currentStep]);
        //_spaceShipLaunch.setRotation(SHIP_ROTATION_BACK[_currentStep]);
        _spaceShip.setPosition(SHIP_POSITIONS[_currentStep]);
        _spaceShipLaunch.runAction(cc.moveTo(2, SHIP_POSITIONS[_currentStep]));
        this.showShipLaunch(true);
    };

    this.backShip = function () {
        _spaceShipLaunch.setRotation(SHIP_ROTATION_BACK[_currentStep]);
    }

    this.showShipLaunch = function(_launch) {
        _spaceShip.setVisible(!_launch);
        _spaceShipLaunch.setVisible(_launch);
    };
    this.getCurrentStep = function() {
        return _currentStep;
    };
    this.changeRotation = function (_value, _ttttt) {
        _spaceShip.setRotation(_ttttt);
        _spaceShipLaunch.setRotation(_ttttt);
        cc.log(" test log " + _ttttt);
    };
    this.getName = function () {
        var name = "nameShip" + Math.floor(Math.random() * 100);
        return name;
    };

    init();
}

    
  
