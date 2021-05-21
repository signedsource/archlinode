BUILD_CMD=pkg -t linux -o
RUN_CMD=node
RM_CMD=rm -rf
PACKAGER_CMD=yarn add
BIN_FOLDER=bin/
SRC_FOLDER=src/

build:
	$(BUILD_CMD) $(BIN_FOLDER)archlinode $(SRC_FOLDER)archlinode.js
	$(BUILD_CMD) $(BIN_FOLDER)postinstall $(SRC_FOLDER)postinstall.js

test:
	$(RUN_CMD) $(SRC_FOLDER)archlinode.js
	$(RUN_CMD) $(SRC_FOLDER)postinstall.js

bintest:
	$(BIN_FOLDER)archlinode
	$(BIN_FOLDER)postinstall

clean:
	$(RM_CMD) $(BIN_FOLDER)

reset:
	$(RM_CMD) $(BIN_FOLDER) node_modules yarn.lock

add:
	$(PACKAGER_CMD) prompts chalk graceful-fs

init:
	$(PACKAGER_CMD) prompts chalk graceful-fs
	$(BUILD_CMD) $(BIN_FOLDER)archlinode $(SRC_FOLDER)archlinode.js
	$(BUILD_CMD) $(BIN_FOLDER)postinstall $(SRC_FOLDER)postinstall.js