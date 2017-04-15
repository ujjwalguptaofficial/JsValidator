var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var DataType;
(function (DataType) {
    DataType[DataType["Email"] = 0] = "Email";
    DataType[DataType["Mobile"] = 1] = "Mobile";
    DataType[DataType["Required"] = 2] = "Required";
    DataType[DataType["Url"] = 3] = "Url";
})(DataType || (DataType = {}));
var Helper = (function () {
    function Helper() {
        this.Errors = [];
        this.getErrorType = function (error) {
            switch (error.toLowerCase()) {
                case 'email': return DataType.Email;
                case 'mobile': return DataType.Mobile;
            }
        };
        /**
         * return the error message
         *
         * @protected
         *
         * @memberOf Helper
         */
        this.getErrorMsg = function (errorType) {
            var ErrorMessage = null;
            this.Errors.array.forEach(function (item) {
                if (item.Type == errorType) {
                    ErrorMessage = item.ErrorMsg;
                }
            });
            if (ErrorMessage == null) {
                return this.getDefaultErrorMsg(errorType);
            }
            return ErrorMessage;
        };
        this.getDefaultErrorMsg = function (errorType) {
            var Msg;
            switch (errorType) {
                case DataType.Required:
                    Msg = "Required Field";
                    break;
                case DataType.Email:
                    Msg = "Invalid Email";
                    break;
                case DataType.Email:
                    Msg = "Invalid Mobile";
                    break;
            }
            return Msg;
        };
        /**
         * check whether value is valid or not
         *
         * @protected
         *
         * @memberOf Helper
         */
        this.isValid = function (value, type) {
            var ErrorOccured, That = this;
            this.Errors.forEach(function (item) {
                if (type = item.Type) {
                    ErrorOccured = That.validateData(value, item);
                }
            });
            if (ErrorOccured == null) {
                ErrorOccured = That.validateData(value, { Type: type });
            }
            return ErrorOccured;
        };
        this.validateData = function (value, error) {
            if (error.Regex) {
                return error.Regex.test;
            }
            else if (error.Code) {
                return error.Code();
            }
            else if (error.MinLength) {
                return value.length >= error.MinLength;
            }
            else if (error.MaxLength) {
                return value.length <= error.MaxLength;
            }
            else {
                switch (error.Type) {
                    case DataType.Email:
                        error.Regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        break;
                    case DataType.Mobile:
                        error.Regex = /^[789]\d{9}$/;
                        break;
                    case DataType.Url:
                        error.Regex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
                        break;
                }
                return error.Regex.test;
            }
        };
    }
    return Helper;
}());
var JsValidator = (function (_super) {
    __extends(JsValidator, _super);
    function JsValidator(errors) {
        if (errors === void 0) { errors = []; }
        var _this = _super.call(this) || this;
        /**
         * validate the value
         *
         *
         * @memberOf JsValidator
         */
        _this.validate = function (value, error, isReq) {
            if (isReq === void 0) { isReq = true; }
            if (isReq) {
                return {
                    Error: true, Message: this.getErrorMsg(DataType.Required)
                };
            }
            if (error != null) {
                return {
                    Error: this.isValid(value, this.getErrorType(error)), Message: this.getErrorMsg(error.Type)
                };
            }
        };
        /**
         * set the error definition
         *
         *
         * @memberOf JsValidator
         */
        _this.setErrorDef = function (error) {
            this.Errors.forEach(function (item, index) {
                if (item.Type == error.Type) {
                    this.Errors.splice(index, 1);
                    return;
                }
            });
            this.Errors.push(error);
        };
        var That = _this;
        errors.forEach(function (item) {
            item.Type = That.getErrorType(item.Type);
            That.Errors.push(item);
        });
        return _this;
    }
    return JsValidator;
}(Helper));
/// <reference path="Business/MainLogic.ts" />
//# sourceMappingURL=JsValidator.js.map