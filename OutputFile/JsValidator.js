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
var Helper = (function () {
    function Helper() {
        this.Errors = [
            {
                Type: 'required',
                ErrorMsg: 'Required field'
            },
            {
                Type: 'email',
                Regex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                ErrorMsg: 'Invalid email'
            },
            {
                Type: 'url',
                Regex: /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/,
                ErrorMsg: 'Invalid url'
            },
            {
                Type: 'number',
                Code: function (value) {
                    return isNaN(value);
                },
                ErrorMsg: "Value should contains only digits"
            },
            {
                Type: 'mobile',
                Regex: /^[789]\d{9}$/,
                ErrorMsg: 'Invalid mobile'
            }
        ];
        /**
         * return the error message
         *
         * @protected
         *
         * @memberOf Helper
         */
        this.getErrorMsg = function (errorType) {
            var Msg;
            this.Errors.every(function (item) {
                if (item.Type == errorType) {
                    Msg = item.ErrorMsg;
                    return true;
                }
                return false;
            });
            return Msg;
        };
        /**
         * check whether value is valid or not
         *
         * @protected
         *
         * @memberOf Helper
         */
        this.isValid = function (value, error) {
            var ErrorOccured = false;
            if (error.Type != undefined) {
                var ErrorDef = this.selectError(error.Type);
                for (var property in ErrorDef) {
                    error[property] = error[property] == null ? ErrorDef[property] : error[property];
                }
            }
            if (error.Is.Required) {
                this.ErrMsg = error.ErrorMsg == undefined ? "Required field" : error.ErrorMsg;
                ErrorOccured = value.toString().length == 0 ? true : false;
            }
            //if regex exist
            if (!ErrorOccured && error.Regex) {
                this.ErrMsg = error.ErrorMsg;
                ErrorOccured = error.Regex.test(value);
            }
            //if code exist
            if (!ErrorOccured && error.Code) {
                this.ErrMsg = error.ErrorMsg;
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
                ErrorOccured = (value === error.Equal.To);
            }
            return ErrorOccured;
        };
        this.selectError = function (type) {
            var OutError;
            this.Errors.every(function (item, index) {
                if (item.Type == type) {
                    OutError = item;
                    OutError['Index'] = index;
                    return false;
                }
                return true;
            });
            return OutError;
        };
        this.selectErrorIndex = function (type) {
            for (var i = 0, length = this.Errors.length; i < length; i++) {
                if (this.Errors[i].Type == type) {
                    return i;
                }
            }
            return -1;
        };
        this.updateError = function (item) {
            var Index = item["Index"], That = this;
            for (var property in item) {
                switch (property) {
                    case 'Type':
                        That.Errors[Index] = item[property];
                        break;
                    case 'Regex':
                        That.Errors[Index] = item[property];
                        break;
                    case 'Code':
                        That.Errors[Index] = item[property];
                        break;
                    case 'ErrorMsg':
                        That.Errors[Index] = item[property];
                        break;
                    case 'Is':
                        That.Errors[Index] = item[property];
                        break;
                }
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
            this.ErrMsg = "";
            // if ((error == undefined || error.Is == undefined || error.Is.Required == undefined ? true : error.Is.Required) && value.length == 0) {
            //     if (error == undefined) {
            //         this.ErrMsg = (error == undefined || error.Is == undefined || error.Is.Msg == undefined) ? this.getErrorMsg((error == undefined || error.Type == undefined) ? "required" : error.Type) : error.Is.Msg;
            //     }
            //     else {
            //         this.ErrMsg = (error == undefined || error.Is == undefined || error.Is.Msg == undefined) ? this.getErrorMsg((error == undefined || error.Type == undefined) ? "required" : error.Type) : error.Is.Msg;
            //     }
            //     return true;
            // }
            if (error == undefined) {
                return this.isValid(value, {
                    Is: {
                        Required: true
                    }
                });
            }
            else if (error.Is == undefined || error.Is.Required == undefined) {
                error["Is"] = {
                    Required: true
                };
                return this.isValid(value, error);
            }
            return this.isValid(value, error);
        };
        /**
         * set the error definition
         *
         *
         * @memberOf JsValidator
         */
        _this.setErrorDef = function (error) {
            var TmpError = this.selectError(error.Type);
            if (TmpError != null && error.Type == TmpError.Type) {
                this.updateError(error);
            }
            else {
                this.Errors.push(error);
            }
        };
        var That = _this;
        errors.forEach(function (item) {
            That.setErrorDef(item);
        });
        return _this;
    }
    return JsValidator;
}(Helper));
/// <reference path="Business/MainLogic.ts" />
// enum DataType {
//     Email,
//     Mobile,
//     Required,
//     Url,
//     Number
// }
// interface IMinMax {
//     Length: number,
//     Msg: string
// }
// interface IError {
//     ErrorMsg: string,
//     Type: DataType,
//     Code: Function,
//     Regex: any,
//     Equal: { To: any, Msg: string },
//     IsRequired: boolean,
//     Min: IMinMax,
//     Max: IMinMax,
//     MinMax: {
//         Min: number,
//         Max: number,
//         Msg: string
//     }
// }
// interface IOutResult {
//     Error: boolean,
//     Message: string
// }
// class Helper {
//     Errors: Array<IError> = [
//     ];
//     protected getErrorType = function (error) {
//         switch (error.toLowerCase()) {
//             case 'email': return DataType.Email;
//             case 'mobile': return DataType.Mobile;
//             case 'url': return DataType.Url;
//             case 'number': return DataType.Number;
//         }
//     }
//     /**
//      * return the error message
//      * 
//      * @protected
//      * 
//      * @memberOf Helper
//      */
//     protected getErrorMsg = function (errorType) {
//         var ErrorMessage = null;
//         this.Errors.forEach(function (item) {
//             if (item.Type == errorType) {
//                 ErrorMessage = item.ErrorMsg;
//             }
//         });
//         if (ErrorMessage == null) {
//             return this.getDefaultErrorMsg(errorType);
//         }
//         return ErrorMessage;
//     }
//     private getDefaultErrorMsg = function (type: DataType) {
//         var Msg;
//         switch (type) {
//             case DataType.Number:
//                 Msg = "Value should contains only digits"; break;
//             case DataType.Required:
//                 Msg = "Required Field";
//                 break;
//             case DataType.Email:
//                 Msg = "Invalid Email";
//                 break;
//             case DataType.Email:
//                 Msg = "Invalid Mobile";
//                 break;
//         }
//         return Msg;
//     }
//     /**
//      * check whether value is valid or not
//      * 
//      * @protected
//      * 
//      * @memberOf Helper
//      */
//     protected isValid = function (value, type): boolean {
//         var ErrorOccured: boolean, That = this;
//         this.Errors.forEach(function (item) {
//             if (type = item.Type) {
//                 ErrorOccured = That.validateData(value, item);
//             }
//         });
//         if (ErrorOccured == null) {
//             ErrorOccured = That.validateData(value, { Type: type }, true);
//         }
//         return ErrorOccured;
//     }
//     private validateData = function (value, error: IError, isDefined = false): boolean {
//         var That = this, ErrorOccured = false, ExecuteDefault = function () {
//             switch (error.Type) {
//                 case DataType.Number:
//                     That.ErrMsg = That.getDefaultErrorMsg(error.Type);
//                     return isNaN(value);
//                 case DataType.Email:
//                     That.ErrMsg = That.getDefaultErrorMsg(error.Type);
//                     var Regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//                     return Regex.test(value);
//                 case DataType.Mobile:
//                     That.ErrMsg = That.getDefaultErrorMsg(error.Type);
//                     var Regex = /^[789]\d{9}$/;
//                     return Regex.test(value);
//                 case DataType.Url:
//                     That.ErrMsg = That.getDefaultErrorMsg(error.Type);
//                     var Regex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
//                     return Regex.test(value);
//             }
//         };
//         if (!isDefined) {
//             ErrorOccured = ExecuteDefault();
//         }
//         else {
//             //if regex exist
//             if (error.Regex) {
//                 this.ErrMsg = this.getDefaultErrorMsg(error.Type);
//                 ErrorOccured = error.Regex.test(value);
//             }
//             //if code exist
//             if (!ErrorOccured && error.Code) {
//                 this.ErrMsg = this.getDefaultErrorMsg(error.Type);
//                 ErrorOccured = error.Code();
//             }
//             //MinMax Check
//             if (!ErrorOccured) {
//                 if (error.MinMax) {  //MinMax
//                     this.ErrMsg = error.MinMax.Msg == undefined ? "The length of Value should be between " + error.MinMax.Min.toString() + "and " + error.MinMax.Max.toString() : error.MinMax.Msg;
//                     ErrorOccured = (value.length >= error.MinMax.Min) && (value.length <= error.MinMax.Max);
//                 }
//                 else if (error.Min) { //Min
//                     this.ErrMsg = "Minimum length should be " + error.Min.Length.toString();
//                     ErrorOccured = value.length >= error.Min.Length;
//                 }
//                 else if (error.Max) { //Min
//                     this.ErrMsg = "Maximum length should be " + error.Max.Length.toString();
//                     ErrorOccured = value.length <= error.Max.Length;
//                 }
//             }
//             // Equal To check
//             if (!ErrorOccured && error.Equal) {
//                 this.ErrMsg = error.Equal.Msg == undefined ? "invalid value" : error.Equal.Msg;
//                 ErrorOccured = value === error.Equal.To;
//             }
//             //Default Execution
//             if (!ErrorOccured) {
//                 ErrorOccured = ExecuteDefault();
//             }
//         }
//         return ErrorOccured;
//     }
// }
// class JsValidator extends Helper {
//     ErrMsg: string;
//     constructor(errors: Array<IError> = []) {
//         super();
//         var That = this;
//         errors.forEach(function (item) {
//             item.Type = That.getErrorType(item.Type);
//             That.Errors.push(item);
//         });
//     }
//     /**
//      * validate the value
//      * 
//      * 
//      * @memberOf JsValidator
//      */
//     validate = function (value, error: IError): boolean {
//         this.ErrMsg = "";
//         if ((error == undefined || error.IsRequired == undefined ? true : error.IsRequired) && value.length == 0) {
//             this.ErrMsg = this.getErrorMsg(DataType.Required);
//             return true;
//         }
//         if (!this.Error && error != null) {
//             return this.isValid(value, this.getErrorType(error.Type));
//         }
//     };
//     /**
//      * set the error definition
//      * 
//      * 
//      * @memberOf JsValidator
//      */
//     setErrorDef = function (error) {
//         this.Errors.forEach(function (item, index) {
//             if (item.Type == error.Type) {
//                 this.Errors.splice(index, 1);
//                 return;
//             }
//         });
//         this.Errors.push(error);
//     }
// }
//# sourceMappingURL=JsValidator.js.map