import { createSimpleHandlerContext } from '../execution';
import { getLogger } from '../logger';

export const handleSimpleCommand = createSimpleHandlerContext('simple-command', _handleSimpleCommand);

async function _handleSimpleCommand() {
  getLogger().info('running simple command', { somePayloadProps: 'asdasdasd' });
  getLogger().error('Error', { somePayloadProps: 'asdasdasd' });
}
