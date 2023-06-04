build:
	npx webpack

zip:
	zip -r zip-dist/save-me-a-click-ai.zip assets/ css/ dist/ html/ manifest.json

default: build zip