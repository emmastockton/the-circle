BUILD=main.go

define commonBuild
echo "building $(TARGET_NAME)"
cd ./server/lambda/$(FILE_NAME)/ && env GOOS=linux go build $(BUILD) && zip $(FILE_NAME).zip main && rm main
mv ./server/lambda/$(FILE_NAME)/$(FILE_NAME).zip ./dist/
endef

build: ## build all of the source files and copy them to the ./dist directory
build: preBuild listenCaptureLambda listenDataStoreLambda listenQuestionTrigger

run: ## runs app on localhost:3000/
	cd ./client && npm run start

preBuild: 
	rm -rf dist
	mkdir dist

# sets variables for listenCaptureLambda
listenCaptureLambda: TARGET_NAME=listenCaptureLambda
listenCaptureLambda: FILE_NAME=listenCapture
listenCaptureLambda:
	$(commonBuild)

# sets variables for listenDataStore
listenDataStoreLambda: BUILD=-o main
listenDataStoreLambda: TARGET_NAME=listenDataStoreLambda
listenDataStoreLambda: FILE_NAME=listenDataStore
listenDataStoreLambda:
	$(commonBuild)

# sets variables for listenQuestionTrigger
listenQuestionTrigger: TARGET_NAME=listenQuestionTrigger
listenQuestionTrigger: FILE_NAME=listenQuestionTrigger
listenQuestionTrigger:
	$(commonBuild)

help:
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'
