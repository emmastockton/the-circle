current_dir = $(shell pwd)

define commonBuild
echo "building $(TARGET_NAME)"
cd ./server/lambda/$(FILE_NAME)/ && env GOOS=linux go build -o $(current_dir)/bin/$(FILE_NAME)
endef

build: ## build all of the source files and copy them to the ./bin directory
build: listenCaptureLambda listenDataStoreLambda listenQuestionTrigger

clean:
	rm -rf ./bin

install: ## install the client dependencies
	npm --prefix ./client install

run: ## runs app on localhost:3000/
	npm --prefix ./client start

# sets variables for listenCaptureLambda
listenCaptureLambda: TARGET_NAME=listenCaptureLambda
listenCaptureLambda: FILE_NAME=listenCapture
listenCaptureLambda:
	$(commonBuild)

# sets variables for listenDataStore
listenDataStoreLambda: TARGET_NAME=listenDataStoreLambda
listenDataStoreLambda: FILE_NAME=listenDataStore
listenDataStoreLambda:
	$(commonBuild)

# sets variables for listenQuestionTrigger
listenQuestionTrigger: TARGET_NAME=listenQuestionTrigger
listenQuestionTrigger: FILE_NAME=listenQuestionTrigger
listenQuestionTrigger:
	$(commonBuild)

deploy: build
	sls deploy --verbose

help:
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'
