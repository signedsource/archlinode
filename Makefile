RUN_CMD=node
RM_CMD=rm -rf
PACKAGER_CMD=yarn add
UPDATE_CMD=yarn
SRC_FOLDER=src/

test:
	$(RUN_CMD) $(SRC_FOLDER)archlinode.js
	$(RUN_CMD) $(SRC_FOLDER)postinstall.js

reset:
	$(RM_CMD) node_modules yarn.lock

add:
	$(PACKAGER_CMD) prompts chalk

init:
	$(PACKAGER_CMD) prompts chalk

update:
	$(UPDATE_CMD)