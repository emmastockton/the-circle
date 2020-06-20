## build all of the source files and copy them to the dist directory
build: preBuild listenCaptureLambda listenDataStoreLambda listenQuestionTrigger

preBuild: 
	rm -rf dist
	mkdir dist

listenCaptureLambda:
	# Build the listenCaptureLambda - This is the lambda that captures responses to questions
	echo "building listenCaptureLambda"
	cd ./server/lambda/listenCapture/ && env GOOS=linux go build main.go && zip listenCapture.zip main && rm main
	mv ./server/lambda/listenCapture/listenCapture.zip ./dist/

listenDataStoreLambda:
	# Build the listenDataStoreLambda - This is the Lambda function that listens to the FIFO queue and stores the data into s3
	echo "building listenDataStoreLambda"
	cd ./server/lambda/listenDataStore/ && env GOOS=linux go build -o main && zip listenDataStore.zip main && rm main
	mv ./server/lambda/listenDataStore/listenDataStore.zip ./dist/

listenQuestionTrigger:
	# Build the listenQuestionTrigger 
	echo "building listenQuestionTrigger"
	cd ./server/lambda/listenQuestionTrigger/ && env GOOS=linux go build main.go && zip listenQuestionTrigger.zip main && rm main
	mv ./server/lambda/listenQuestionTrigger/listenQuestionTrigger.zip ./dist/

run: 
	cd ./client && npm run start
	