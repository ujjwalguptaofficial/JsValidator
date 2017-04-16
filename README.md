# JsValidator

#How to use 
1. download the file
2. find the script under output folder
3. include it in your html file

#Doc

## Check for null
```
var Validator=new JsValidator();
var Name=document.getElementById('txtName');
if(Validator.validate(Name.value)) // return true if error otherwise false
{
    alert(Validator.ErrMsg); // Validator.ErrMsg will contains the current Error Message
}

```
## check for different datatype -  email,url,mobile,number
```
var Validator=new JsValidator();
var Price=document.getElementById('txtPrice');
//check number
if(Validator.validate(Price.value,{ Type:'number'})) // return true if error otherwise false
{
    alert(Validator.ErrMsg); // Validator.ErrMsg will contains the current Error Message
}

//for email,url, mobile : replace type with the value like email,url,mobile - e.g -

if(Validator.validate(Price.value,{ Type:'email'})) // return true if error otherwise false
{
    alert(Validator.ErrMsg); // Validator.ErrMsg will contains the current Error Message
}

//###Note :- the mobile no check is for indian no only. So in the case if something is not working for you - you can define the custom check

```
###Note :- currently we support following datatype -
1.Email
2.Url
3.Mobile
4.Number

## Custom Check
'''
var Validator=new JsValidator();
var Price=document.getElementById('txtMob');


## Check for Min or Max length
```
var Validator=new JsValidator();
var Price=document.getElementById('txtPrice');
//Min length
// this will check for both number and value of min length 3 - Msg is optional
if(Validator.validate(Price.value,{ Type:'number',Min:{Length:3, Msg:"Min length should be 3"}})) 
{
    alert(Validator.ErrMsg); // Validator.ErrMsg will contains the current Error Message
}

//Max length
// this will check for both number and value of min length 3 - add Msg if you want the custom message
if(Validator.validate(Price.value,{ Type:'number',Max:{Length:3}})) 
{
    alert(Validator.ErrMsg); // Validator.ErrMsg will contains the current Error Message
}

//Min and MAx both - add Msg in MinMax to get the custom message
if(Validator.validate(Price.value,{ Type:'number',MinMax:{Min:3,Max:5}}))
{
    alert(Validator.ErrMsg); // Validator.ErrMsg will contains the current Error Message
}

```
