import { describe } from 'zip-tap';
import messageHandler, { Options } from '../src/game/message-handler';

describe(`Actions`, it => {
	it(`should register messages`, expect => {
		const options: Options = {
			onClientAdded: (data: { id: string }) => {
				expect(data).toMatchObject({ id: 'hello' });
				return data.id + '-id';
			},
		};
		const action = messageHandler(options);

		action.client.addClient(`some-client`, { id: 'hello' });

		action.register(`timer`, (params: { time: number }, user) => {
			expect(params).toMatchObject({ time: 10 });
			expect(user).toBe('hello-id');
		});

		action.client.handleMessage({ key: `timer`, params: { time: 10 } }, `some-client`);
	});
});
