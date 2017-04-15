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
            var That = this, Result = {}, ExecuteDefault = function () {
                switch (error.Type) {
                    case DataType.Number:
                        return { Error: !isNaN(value), Message: That.getDefaultErrorMsg(error.Type) };
                    case DataType.Email:
                        var Regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        return { Error: Regex.test(value), Message: "Invalid Email" };
                    case DataType.Mobile:
                        var Regex = /^[789]\d{9}$/;
                        return { Error: Regex.test(value), Message: That.getDefaultErrorMsg(error.Type) };
                    case DataType.Url:
                        var Regex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
                        return { Error: Regex.test(value), Message: That.getDefaultErrorMsg(error.Type) };
                }
            };
            if (!isDefined) {
                return ExecuteDefault();
            }
            else {
                //if regex exist
                if (error.Regex) {
                    return { Error: error.Regex.test(value), Message: That.getDefaultErrorMsg(error.Type) };
                }
                //if code exist
                if (error.Code) {
                    return { Error: error.Code(), Message: That.getDefaultErrorMsg(error.Type) };
                }
                //MinMax Check
                if (error.MinMax) {
                    return {
                        Error: (value.length >= error.MinMax.Min) && (value.length <= error.MinMax.Max),
                        Message: error.MinMax.Msg == undefined ? "The length of Value should be between " + error.MinMax.Min.toString() + "and " + error.MinMax.Max.toString() : error.MinMax.Msg
                    };
                }
                //Min check
                if (error.Min) {
                    return {
                        Error: value.length >= error.Min.Length,
                        Message: "Minimum length should be " + error.Min.Length.toString()
                    };
                }
                // Max check
                if (error.Max) {
                    return {
                        Error: value.length <= error.Max.Length,
                        Message: "Maximum length should be " + error.Max.Length.toString()
                    };
                }
                // Equal To check
                if (error.Equal) {
                    return {
                        Error: value === error.Equal.To,
                        Message: error.Equal.Msg == undefined ? "invalid value" : error.Equal.Msg
                    };
                }
                //Default Execution
                return ExecuteDefault();
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
        _this.validate = function (value, error) {
            (error == undefined || error.IsRequired == undefined) ? true : error.IsRequired;
            if ((error == undefined || error.IsRequired) && value.length == 0) {
                return {
                    Error: true, Message: this.getErrorMsg(DataType.Required)
                };
            }
            if (error != null) {
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