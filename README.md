# Run the project

1. Clone the project 
	``` git clone https://github.com/jainmanishs/ng-main-app.git ```

2. Go to project Folder
	``` cd  ng-main-app ```

3. Then run following command to pull the sub-modules(projects)
	``` git submodule update --init --recursive ```

4. do 
	``` npm i ```
 
5. To run the main project  in the ng-main-app folder
	``` ng s ``` 

6. To run the specific sub project in the ng-main-app folder
	``` ng s --project=ng-app-one ```
 




## Add New Project

1. To add new sub project create new git repository in github for that sub project
2. Clone the new blank github repository  in some temp folder
3. To Create new project first go to ng-main-app folder in cmd
	``` cd ng-main-app folder ```
    then, 
	``` ng generate application <app-name> –-routing ```

    Note: Make sure the github repository name must be same as <app-name>

4. Cut all content of  ng-main-app/Projects/<app-name> and paste  to the temp folder/<app-name> and then delete the <app-name> folder from ng-main-app/Projects/<app-name>
5. Now push the changes to newly created git repository (in step 1)
6. In ng-main-app Project sync all the changes.
7. Now in ng-main-app folder in cmd run the following command
	 ``` git submodule add <remote_url> <destination_folder> ```
	 Ex : ``` git submodule add https://github.com/debabratapaulchowdhury/ng-app-four.git projects/ng-app-four ```

8. Now commit and sync changes in the main repository i.e  ng-main-app repository 
9. Now we will use  ng-main-app project sub project instead of temp folder
10. Injecting Sub Apps into Main application

	-> In app.module.ts of newly created sub-application (in ng-main-app project) add code below export class AppModule{}

		
		const providers = []

		@NgModule({})
		export class <app-name>SharedModule{
  		static forRoot(): ModuleWithProviders {
    		return {
      				ngModule: AppModule,
      				providers: providers
    			}
  		}
		}




11. In app.module.ts  of the ng-main-app folder
	add following in imports

	``` <app-name>SharedModule.forRoot(), ```

12. Sync all the above changes

## Login/Renew Token Using adfs implementation
 [See Document](/documentations/adfs-login-documentation.md)


## other commands


To update specific project/module git repository.  
	 ``` git submodule update --remote projects/ng-app-one ```
