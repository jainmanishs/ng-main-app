#Implement Shared Component

**Create shared component in ng-main-app\src\app\shared**
**Add Component in shared.module.ts->export[]**

```
exports:[
...OtherComponent,
<New-Created-Component>
]

```

>Skip Step If Already Performed in Operand Sub-application

**Add SharedModule in Sub-Apps's AppModule.ts-> Import[]**


```
imports:[
...OtherComponent,
sharedModule
]

```
