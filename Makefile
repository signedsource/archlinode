BUILD_CMD=pkg -t linux -o
RUN_CMD=node
RM_CMD=rm -rf
PACKAGER_CMD=yarn add

build:
	$(BUILD_CMD) bin/archlinode src/archlinode.js
	$(BUILD_CMD) bin/postinstall src/postinstall.js

test:
	$(RUN_CMD) src/archlinode.js
	$(RUN_CMD) src/postinstall.js

clean:
	$(RM_CMD) bin

reset:
	$(RM_CMD) bin node_modules yarn.lock

add:
	$(PACKAGER_CMD) prompts chalk graceful-fs common-tags