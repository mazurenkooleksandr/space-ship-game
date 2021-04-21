simpleScene = cc.Scene.extend({
    ICONS_NUMBER: 8,
    REEL_SIZE: 4,
    POSITION_X: [150,480,800],
    POSITION_Y: [700,500,300,100],
    PLANETS: ["Go to Start","Go to Pluto","Go to Charon","Go to Triton","Go to Neptune","Go to Titania","Go to Uranus","Go to Titan","Go to Saturn","Go to Jupiter","Go to Asteroid belt","Go to Mars","Go to Moon","You're home!"],
    SPIN_TIME: [2, 2.5, 3.5],
    TIME_DOWN_ICON: 0.25,
    DIRECTION: 1,
    _size: null,
    _ship: null,
    _spinButton: null,
    _start: false,
    _redLine: null,
    _result: null,
    _slotContainer: null,
    _currentSpinTime: 0,
    _reelsStates: [false, false, false],
    _currentBet: 0,
    _background: null,
    _grill: null,
    _dialogWindow: null,
    _buttonCancel: null,
    _buttonInfo: null,
    _winIdArr: [0, 3, 5, 7],
    _losIdArr: [1, 2, 4, 6],
    _spaceShip: null,
    _spaceShipLaunch: null,
    onEnter: function() {
        this._super();
        this._start = false;
        this._size = cc.director.getWinSizeInPixels(),
        this._createSlotScene();
    },
    
    _createSlotScene: function() {
        this._createResultField();
        this._createMask();
        this._createBackgroung();
        this._createSlots();
        this._createRedLine();
        this._createGreenLine();
        this._createBtns();
        this._createSpaceShip();
    },

    _createRedLine: function () {
        this._redLine = new cc.DrawNode();
        this._redLine.drawSegment(cc.p (1110,790), cc.p(150,790),4, cc.color(255,0,0));
        this._redLine.setVisible(false);
        this.addChild(this._redLine, 6);
    },

    _createGreenLine: function () {
        this._greenLine = new cc.DrawNode();
        this._greenLine.drawSegment(cc.p (1110,790), cc.p(150,790),4, cc.color(0,128,0));
        this._greenLine.setVisible(false);
        this.addChild(this._greenLine, 6);
    },

    _createResultField: function() {
        this._result = cc.LabelTTF.create("Welcome", "Nunito", 50);
        this._result.setFontFillColor("black");
        this._textureSetting(this._result, 460, 300, 1, 1);
    },

    _createBackgroung: function (){
        this._background = cc.Sprite.create("img/bg.jpg");
        this._textureSetting(this._background, 940, 650, 1.45, 0);
    },

    _createMask: function() {
        var rect = [];
        rect[0] = cc.p(0, 0);
        rect[1] = cc.p(967, 0);
        rect[2] = cc.p(967, 587);
        rect[3] = cc.p(0, 587);
        this._slotContainer = cc.Node.create();
        var mask = new cc.DrawNode();
        mask.clear();
        mask.drawPoly(rect, cc.color.WHITE, 2, cc.color.WHITE);
        this._grill = cc.Sprite.create("img/grill.png");
        this._textureSetting(this._grill, 620, 745, 4, 6);
        var maskedFill = new cc.ClippingNode(mask);
        maskedFill.addChild(this._slotContainer);
        maskedFill.setInverted(false);
        maskedFill.setPosition(147,495);
        this.addChild(maskedFill,1);   
    },

    _createSlots: function() {
        cc.spriteFrameCache.addSpriteFrames("img/icons.plist");
        this._reels = [];
        for (var i = 0; i < this.POSITION_X.length; i++) {
            this._reels.push(this._createReel(i));
        }
        this._reelsStates = [true, true, true];
    },

    _createReel: function (_reelIndex) {
        var tempArray = [];
        for (var i = 0; i < this.REEL_SIZE; i++) {
            var iconId = Math.floor(this._getRandomInt(this.ICONS_NUMBER));
            var icon = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("icons/" + iconId + ".png"));
            icon.iconId = iconId;
            tempArray.push(icon);
            icon.setPosition(cc.p(this.POSITION_X[_reelIndex], this.POSITION_Y[i])); 
            this._slotContainer.addChild(icon, 1);  
        };
        return tempArray;
    },

    _setSpinBtnEnable: function(_param) {
        this._spinButton.setBright(_param);
        this._spinButton.setHighlighted(_param);
    },

    _textureSetting: function (_texture, _x, _y, _scale, _z, _parent) {
        _texture.setPosition(_x, _y);
        _texture.setScale(_scale);
        if (_parent) {
            _parent.addChild(_texture, _z);
        } else {
            this.addChild(_texture, _z);
        }
    },

    _runSpin: function() {
        if (this._start) {
            return;
        }

        this._start = true;
        this._result.setString("Spinning");
        this._currentSpinTime = 0;
        this._spinLogic();
        this._playReelsSound();
        var testText = Math.floor(Math.random() * 100);
        var randomNameShip = this._ship.getName();
        cc.log("name: " + randomNameShip);
    },

    _spinLogic: function () {
        if(!this._start) {
            return;
        }
        this._currentSpinTime += this.TIME_DOWN_ICON;
        for (i = 0; i < this._reels.length; i++) {
            var isLastReel = i === (this._reels.length - 1);
            if (this._reelsStates[i]) {
                for (j = 0; j < this._reels[i].length; j++) {
                    var icon = this._reels[i][j];
                    var params = {
                        reelIndex: i,
                        isLastReel: isLastReel
                    };
                    var seq = cc.sequence([
                        cc.moveBy(this.TIME_DOWN_ICON, 0, -200 * this.DIRECTION), 
                        cc.callFunc(this._shiftIcon.bind(this), icon, params)
                    ]);
                    icon.runAction(seq);
                }
            } else if (isLastReel) {
                this._spinEnd();
            }
        }   
    },

    _shiftIcon: function (_icon, _params) {
        if (_icon.getPositionY() < 0) {
            _icon.setPositionY(this.POSITION_Y[0]);
            _icon.iconId = Math.floor(this._getRandomInt(this.ICONS_NUMBER));
            _icon.initWithSpriteFrameName("icons/" + _icon.iconId + ".png"); 
            this._reels[_params.reelIndex].unshift(this._reels[_params.reelIndex].pop());
            if (this._currentSpinTime >= this.SPIN_TIME[_params.reelIndex]) {
                this._reelsStates[_params.reelIndex] = false;
            }
            if (_params.isLastReel) {
                this._spinLogic();
            }
        } 
    },

    _spinEnd: function (_spin) {
        this._reelsStates = [true, true, true];
        this._checkWinnner();
        this._start = false;
        this._setSpinBtnEnable(true);
    },


    _checkWinCombinationPresent: function() {
        var _icon1 = this._reels[0][2];
        var _icon2 = this._reels[1][2];
        var _icon3 = this._reels[2][2];
        var win12 = (_icon1.iconId === _icon2.iconId && this._winIdArr.indexOf(_icon1.iconId) !== -1);
        var win23 = (_icon2.iconId === _icon3.iconId && this._winIdArr.indexOf(_icon2.iconId) !== -1);
        var win13 = (_icon1.iconId === _icon3.iconId && this._winIdArr.indexOf(_icon3.iconId) !== -1);
        var resultWin = (win12 || win23 || win13);

        var lose12 = (_icon1.iconId === _icon2.iconId && this._losIdArr.indexOf(_icon1.iconId) !== -1);
        var lose23 = (_icon2.iconId === _icon3.iconId && this._losIdArr.indexOf(_icon2.iconId) !== -1);
        var lose13 = (_icon1.iconId === _icon3.iconId && this._losIdArr.indexOf(_icon3.iconId) !== -1);
        var resultLose = (lose12 || lose23 || lose13);

        var totalResult = resultWin || resultLose;
        return totalResult;
    },

    _checkResult: function() {
        var result = {
            "notWin": true,
            "increase": false
        };

        var icon1 = this._reels[0][2];
        var icon2 = this._reels[1][2];
        var icon3 = this._reels[2][2];

        function checkCombination (_array, _icon1, _icon2, _icon3) {
            var win12 = (_icon1.iconId === _icon2.iconId && _array.indexOf(_icon1.iconId) !== -1);
            var win23 = (_icon2.iconId === _icon3.iconId && _array.indexOf(_icon2.iconId) !== -1);
            var win13 = (_icon1.iconId === _icon3.iconId && _array.indexOf(_icon3.iconId) !== -1);
            return (win12 || win23 || win13)
        }

        if (checkCombination(this._winIdArr, icon1, icon2, icon3)) {
            result.increase = true;
            result.notWin = false;
        } else {
            if (checkCombination(this._losIdArr, icon1, icon2, icon3)) {
                result.increase = false;
                result.notWin = false;
            }
        }

        return result;
    },

    _checkWinnner: function() {
        var result = this._checkResult();
        if (result.notWin) {
            this._result.setString("Not Win");
        } else if (result.increase) {
            //win 
            this._ship.udateState(true);
            this._result.setString(this.PLANETS[this._ship.getCurrentStep()]);
            this._greenLine.setVisible(true);
            this._playShipSound();
        } else {
            //lose
            this._redLine.setVisible(true);
            if (this._ship.getCurrentStep() === 0) {
                this._result.setString("Stand still");
            } else {
                this._ship.udateState(false);
                this._ship.backShip();
                this._result.setString(this.PLANETS[this._ship.getCurrentStep()]);
                this._playShipSound(); 
            }
        }
    },
    _getRandomInt: function (int) {
        return Math.random() * int;
    },

    _createBtns: function () {
        this._spinButton = new ccui.Button('img/button_spin.png', 'img/button_spin.png', 'img/button_spin_blocked.png');
        this._buttonInfo = new ccui.Button('img/button_info.png');
        this._buttonCancel = new ccui.Button('img/button_x.png');
        this._createBtn(this._spinButton, true, 630, 446, 1.3, 1);
        this._createBtn(this._buttonInfo, true, 220, 446, 1, 1);  
    },

    _createBtn: function (_btn, _enable, _posX, _posY, _scale, _zOrder, _parent){
        this._setBtnEnable(_btn, _enable);
        _btn.setVisible(_enable);
        _btn.addTouchEventListener(this._touchEventBtn, this);
        this._textureSetting(_btn, _posX, _posY, _scale, _zOrder, _parent);
    },

    _createDialogWindow: function () {
        this._dialogWindow = new cc.Sprite("img/bkg_paytable.png");
        this._textureSetting(this._dialogWindow, 640, 512, 0.05, 6);
        this._createBtn(this._buttonCancel, true, 900, 700, 1, 7, this._dialogWindow);
        var scaleAction = cc.scaleTo(0.5, 1.2, 1.2);
        this._dialogWindow.runAction(scaleAction);
    },
    
    _createDestroyDialogWindow: function () {
        this._dialogWindow.removeAllChildren();
        this._dialogWindow.removeFromParent();
        this._dialogWindow = null;
    },

    _setBtnEnable: function (_btn, _param) {
        _btn.setBright(_param);
        _btn.setHighlighted(_param);
        _btn.setTouchEnabled(_param)
    },

    _playBtnSound: function () {
        cc.audioEngine.playEffect("sounds/btns.mp3");
    },

    _playShipSound: function () {
        cc.audioEngine.playEffect("sounds/ship-sound.wav");
    },

    _playReelsSound: function () {
        cc.audioEngine.playEffect("sounds/wheel-of-fortune.mp3");
    },

    _createSpaceShip: function () {
        this._ship = new Ship(this); 
    },

    _touchEventBtn: function (sender,  type) {
        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
                if (sender === this._spinButton) {
                    this._setSpinBtnEnable(false);
                    this._redLine.setVisible(false);
                    this._greenLine.setVisible(false);
                    this._ship.showShipLaunch(false);
                    this._runSpin();
                } else if (sender === this._buttonInfo) {
                    this._createDialogWindow();
                } else if (sender === this._buttonCancel) {
                    this._createDestroyDialogWindow();
                }

            break;
        }
    },
});