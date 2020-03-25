# Game API

## Creating a new game

To create a new Game, send a POST request to `/api/games`.

You will get a six-digit game id.

## Deleting a game

Just send a DELETE request to `/api/games/:game`.

## Joining a game

Just send a websocket up to `/api/games/:game`.

You can't join a game after it has been started.

If the websocket connection fails for some reason, just send along a new request like this with the same userId as before. Even if the game has already been started, the server should let you in.

In the body of the request you must send the user info.

```json
{
	"id": "18341532451",
	"name": "Billy",
	"gender": "male"
}
```

There are a series of messages that can be sent after that.

Send them in this form:

```json
{
	"key": string,
	"params": {
		// ...
	}
}
```

The first websocket to connect after creating a new game is considered the game owner. That means that he has special priviledges.

### Before the game starts

#### Getting the other users

As soon as a successfull upgrade is acomplished, the sever will beam down an array of the user users.

And anytime a new user is added, the server will beam that down also.

#### Changing the game settings

Only owners can do this.

Message Key: `set-settings`,
Message Content: `Settings`

#### Starting the game

Owners only.

Message Key: `start-game`

### Once the game has started...

The server will beam down each players role.

Message Type: `role`,
Content: `"mafia"|"doctor"|...`

The owner can them send up a message to start the first round:

Type: `start-next-round`

#### Playing a round

A message with a `round`, `number` (key, content respectivley) will be beamed down to all clients.

##### Timer

A timer will also start ticking.

Type: `timer`,
Content: the amount of seconds left

The owner can pause and play the timer

Type: `timer`
Content: `"pause"|"play"`

##### Selections

It is then each clients responsibility to send up a selection. Judges and Villagers must send up a snort string.

Type: `selection`
Content: user id or snort

If the client does not send up a snort or user, the server will pick randomly from the list of options.

##### The narrative

When all the users have a selection, the server will send down the narrative.

Type: `narrative`
Content: `{ story: string, eliminated: { id: string, role: string }[], snorts: string[] }`

When any client sends up a `next` message, the server will beam down either a `trial`, `round-over`, or `game-over` message.

##### Trials

The server will beam down a `trial`, `{ isCitezensArrest: boolean, user: string, canVote: boolean, accusedBy: string }` message.

When the owner sends up a `start-vote` message, each user must make a selection before the [timer](#timer) is up.

If they do not, the server will pick for them.

If canVote is `false` the client must send up a snort.

Else, send up a `{ guilty: boolean }` message.

If it is a citezens arrest, one of the judges is chosen to vote. Otherwise, everyone can vote.

Once everyone has voted, the sever will send down a `vote-result`, `{ guilty: boolean, inocent: string[], guilty: string[], snorts: string[], role?: string }` message. The `innocent` and `guilty` fields are the userId's of the people who voted each way. If only a judge voted, the id will be `JUDGE`.

If `guilty` is `true`, the `role` field will be included.

When any client sends up a `next` message, the server will beam down either a `trial`, `round-over`, or `game-over` message.

#### Game Over

When all mafias have been killed, a `game-over` `User[]`, message will be dispatched.

The `User` type includes the `role` of each user.
