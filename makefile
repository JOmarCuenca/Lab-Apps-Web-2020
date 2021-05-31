buildAndDeploy:
	@echo "######################## Building Project ###################################"
	@echo ""
	@echo ""
	cd project && yarn && yarn upgrade && yarn build
	@echo "#################### Replacing Firebase Public Directory ####################"
	@echo ""
	@echo ""
	rm -rf firebase/public
	mv project/build firebase/public
	@echo "########## Deploying to the Firebase DNS Hosting Service ####################"
	@echo ""
	@echo ""
	cd firebase && firebase deploy

compile-deploy-action:
	@echo "################## Building the new Compiled Site ##########################"
	cd project && yarn && yarn upgrade && yarn build
	mv project/build firebase/public