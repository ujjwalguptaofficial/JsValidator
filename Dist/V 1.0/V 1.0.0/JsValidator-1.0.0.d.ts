/** JsValidator.js - v1.0.0 - 13/09/2017
 * https://github.com/ujjwalguptaofficial/JsValidator
 * Copyright (c) 2017 @Ujjwal Gupta; Licensed MIT */
interface IMinMax {
    Length: number;
    Msg: string;
}
interface IError {
    ErrorMsg: string;
    Type: string;
    Code: Function;
    Regex: RegExp;
    Equal: {
        To: any;
        Msg: string;
    };
    Is: {
        Required: boolean;
        Msg: string;
    };
    Min: IMinMax;
    Max: IMinMax;
    MinMax: {
        Min: number;
        Max: number;
        Msg: string;
    };
}
interface IOutResult {
    Error: boolean;
    Message: string;
}
declare class Helper {
    IsAnyError: boolean;
    Errors: Array<IError>;
    /**
     * return the error message
     *
     * @protected
     *
     * @memberOf Helper
     */
    protected getErrorMsg: (errorType: any) => any;
    /**
     * check whether value is valid or not
     *
     * @protected
     *
     * @memberOf Helper
     */
    protected isError: (value: any, error: IError) => boolean;
    selectError: (type: string) => IError;
    selectErrorIndex: (type: string) => number;
    updateError: (item: IError) => void;
}
declare class JsValidator extends Helper {
    ErrMsg: string;
    constructor(errors?: Array<IError>);
    /**
     * validate the value
     *
     *
     * @memberOf JsValidator
     */
    isInvalid: (value: any, error: IError) => boolean;
    isValid: (value: any, error: IError) => boolean;
    /**
     * set the error definition
     *
     *
     * @memberOf JsValidator
     */
    setErrorDef: (error: any) => void;
    startValidation: () => void;
}
