
interface IMinMax {
    Length: number,
    Msg: string
}

interface IError {
    ErrorMsg: string,
    Type: string,
    Code: Function,
    Regex: RegExp,
    Equal: { To: any, Msg: string },
    Is: { Required: boolean, Msg: string },
    Min: IMinMax,
    Max: IMinMax,
    MinMax: {
        Min: number,
        Max: number,
        Msg: string
    }
}

interface IOutResult {
    Error: boolean,
    Message: string
}

class Helper {
    Errors: Array<IError> = [

        <IError>{
            Type: 'required',
            ErrorMsg: 'Required field'
        },
        <IError>{
            Type: 'email',
            Regex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            ErrorMsg: 'Invalid email'
        },
        <IError>{
            Type: 'url',
            Regex: /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/,
            ErrorMsg: 'Invalid url'
        },
        <any>{
            Type: 'number',
            Code: function (value) {
                return isNaN(value);
            },
            ErrorMsg: "Value should contains only digits"
        },
        <IError>{
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
    protected getErrorMsg = function (errorType) {
        var Msg;
        this.Errors.every(function (item) {
            if (item.Type == errorType) {
                Msg = item.ErrorMsg;
                return true;
            }
            return false;
        });
        return Msg;
    }

    /**
     * check whether value is valid or not
     * 
     * @protected
     * 
     * @memberOf Helper
     */
    protected isValid = function (value, error: IError): boolean {
        var ErrorOccured = false;
        if (error.Type != undefined) {
            var ErrorDef = this.selectError(error.Type);
            for (var property in ErrorDef) {
                error[property] = error[property] == null ? ErrorDef[property] : error[property];
            }
        }
        if (error.Is.Required) {
            this.ErrMsg = error.Is.Msg == undefined ? "Required field" : error.Is.Msg;
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
            ErrorOccured = error.Code(value);
        }
        //MinMax Check
        if (!ErrorOccured) {
            if (error.MinMax) {  //MinMax
                this.ErrMsg = error.MinMax.Msg == undefined ? "The length of Value should be between " + error.MinMax.Min.toString() + "and " + error.MinMax.Max.toString() : error.MinMax.Msg;
                ErrorOccured = (value.length >= error.MinMax.Min) && (value.length <= error.MinMax.Max);
            }
            else if (error.Min) { //Min
                this.ErrMsg = "Minimum length should be " + error.Min.Length.toString();
                ErrorOccured = value.length >= error.Min.Length;
            }
            else if (error.Max) { //Min
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
    }

    selectError = function (type: string): IError {
        var OutError;
        this.Errors.every(function (item: IError, index) {
            if (item.Type == type) {
                OutError = item;
                OutError['Index'] = index
                return false;
            }
            return true;
        })
        return OutError;
    }

    selectErrorIndex = function (type: string): number {
        for (var i = 0, length = this.Errors.length; i < length; i++) {
            if (this.Errors[i].Type == type) {
                return i;
            }
        }
        return -1;
    }

    updateError = function (item: IError) {
        var Index = item["Index"],
            That = this;
        for (var property in item) {
            switch (property) {
                case 'Type': That.Errors[Index] = item[property]; break;
                case 'Regex': That.Errors[Index] = item[property]; break;
                case 'Code': That.Errors[Index] = item[property]; break;
                case 'ErrorMsg': That.Errors[Index] = item[property]; break;
                case 'Is': That.Errors[Index] = item[property]; break;
            }
        }
    }
}

class JsValidator extends Helper {
    ErrMsg: string;

    constructor(errors: Array<IError> = []) {
        super();
        var That = this;
        errors.forEach(function (item) {
            That.setErrorDef(item);
        });
    }

    /**
     * validate the value
     * 
     * 
     * @memberOf JsValidator
     */
    validate = function (value, error: IError): boolean {
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
            return this.isValid(value, <IError>{
                Is: {
                    Required: true
                }
            });
        }
        else if (error.Is == undefined || error.Is.Required == undefined) {
            error["Is"] = <any>{
                Required: true
            }
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
    setErrorDef = function (error) {
        var TmpError = this.selectError(error.Type);
        if (TmpError != null && error.Type == TmpError.Type) {
            this.updateError(error);
        }
        else {
            this.Errors.push(error);
        }
    }

}

