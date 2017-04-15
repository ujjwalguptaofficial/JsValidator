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
    DataType[DataType["Number"] = 4] = "Number";
})(DataType || (DataType = {}));
var Helper = (function () {
    function Helper() {
        this.Errors = [];
        this.getErrorType = function (error) {
            switch (error.toLowerCase()) {
                case 'email': return DataType.Email;
                case 'mobile': return DataType.Mobile;
                case 'url': return DataType.Url;
                case 'number': return DataType.Number;
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
            this.Errors.forEach(function (item) {
                if (item.Type == errorType) {
                    ErrorMessage = item.ErrorMsg;
                }
            });
            if (ErrorMessage == null) {
                return this.getDefaultErrorMsg(errorType);
            }
            return ErrorMessage;
        };
        this.getDefaultErrorMsg = function (type) {
            var Msg;
            switch (type) {
                case DataType.Number:
                    Msg = "Value should contains only digits";
                    break;
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
                ErrorOccured = That.validateData(value, { Type: type }, true);
            }
            return ErrorOccured;
        };
        this.validateData = function (value, error, isDefined) {
            if (isDefined === void 0) { isDefined = false; }
            var That = this, ErrorOccured = false, ExecuteDefault = function () {
                switch (error.Type) {
                    case DataType.Number:
                        That.ErrMsg = That.getDefaultErrorMsg(error.Type);
                        return isNaN(value);
                    case DataType.Email:
                        That.ErrMsg = That.getDefaultErrorMsg(error.Type);
                        var Regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        return Regex.test(value);
                    case DataType.Mobile:
                        That.ErrMsg = That.getDefaultErrorMsg(error.Type);
                        var Regex = /^[789]\d{9}$/;
                        return Regex.test(value);
                    case DataType.Url:
                        That.ErrMsg = That.getDefaultErrorMsg(error.Type);
                        var Regex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
                        return Regex.test(value);
                }
            };
            if (!isDefined) {
                ErrorOccured = ExecuteDefault();
            }
            else {
                //if regex exist
                if (error.Regex) {
                    this.ErrMsg = this.getDefaultErrorMsg(error.Type);
                    ErrorOccured = error.Regex.test(value);
                }
                //if code exist
                if (!ErrorOccured && error.Code) {
                    this.ErrMsg = this.getDefaultErrorMsg(error.Type);
                    ErrorOccured = error.Code();
                }
                //MinMax Check
                if (!ErrorOccured) {
                    if (error.MinMax) {
                        this.ErrMsg = error.MinMax.Msg == undefined ? "The length of Value should be between " + error.MinMax.Min.toString() + "and " + error.MinMax.Max.toString() : error.MinMax.Msg;
                        ErrorOccured = (value.length >= error.MinMax.Min) && (value.length <= error.MinMax.Max);
                    }
                    else if (error.Min) {
                        this.ErrMsg = "Minimum length should be " + error.Min.Length.toString();
                        ErrorOccured = value.length >= error.Min.Length;
                    }
                    else if (error.Max) {
                        this.ErrMsg = "Maximum length should be " + error.Max.Length.toString();
                        ErrorOccured = value.length <= error.Max.Length;
                    }
                }
                // Equal To check
                if (!ErrorOccured && error.Equal) {
                    this.ErrMsg = error.Equal.Msg == undefined ? "invalid value" : error.Equal.Msg;
                    ErrorOccured = value === error.Equal.To;
                }
                //Default Execution
                if (!ErrorOccured) {
                    ErrorOccured = ExecuteDefault();
                }
            }
            return ErrorOccured;
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
        _this.validate = function (value, error) {
            this.ErrMsg = "";
            if ((error == undefined || error.IsRequired == undefined ? true : error.IsRequired) && value.length == 0) {
                this.ErrMsg = this.getErrorMsg(DataType.Required);
                return true;
            }
            if (!this.Error && error != null) {
                return this.isValid(value, this.getErrorType(error.Type));
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