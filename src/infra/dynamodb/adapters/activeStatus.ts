import { PutItemCommand, DeleteItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb"
import { unmarshall } from "@aws-sdk/util-dynamodb"
import { client } from "../config.js";
import { ActiveStatus } from "types/activeStatus.js";

async function update(pokemon?) {
  const response = await client.send(new PutItemCommand({
    "TableName": "ServerActiveMonster",
    "Item": { ...emptyItem(), ...mapToDynamoDB(pokemon) }
  }))
  return response
}

async function getLast(): Promise<ActiveStatus> {
  const response = await client.send(new QueryCommand({
    TableName: "ServerActiveMonster",
    Select: "ALL_ATTRIBUTES",
    KeyConditionExpression: "server_id = :defined",
    ExpressionAttributeValues: {
      ":defined": {
        "S": "1"
      }
    }
  }))

  const lastItem = response.Items?.at(0)

  if (!lastItem) {
    console.warn("Unsubscribed server tries to get pokemon")
    return {
      date: new Date()
    }
  }

  return mapDynamoToActiveStatus(lastItem)
}

function emptyItem() {
  return {
    "server_id": {
      "S": "1"
    },
    "interaction_timestamp": {
      "N": String(new Date().getTime())
    },
  }
}

function mapDynamoToActiveStatus(entry): ActiveStatus {
  const e = unmarshall(entry)

  const status: ActiveStatus = {
    date: new Date(e.interaction_timestamp),
  }

  if (e.name)
    status.pokemon = {
      name: e.name,
      id: e.id,
      shiny: e.shiny,
      chance: e.chance,
      stats: e.stats.reduce((acc, s) => {
        if (s.name === "special-attack") {
          acc.sp_attack = s.value;
        } else if (s.name === "special-defense") {
          acc.sp_defense = s.value;
        } else {
          acc[s.name] = s.value;
        }
        return acc;
      }, {})
    }

  return status
}

function mapToDynamoDB(pokemon): any {
  return pokemon ?
    {
      chance: { N: String(pokemon.chance.toString()) },
      id: { N: String(pokemon.id.toString()) },
      name: { S: pokemon.name },
      shiny: { BOOL: String(pokemon.shiny) },
      stats: {
        L: pokemon.stats.map(s => {
          return {
            M: {
              name: { S: s.stat.name },
              value: { N: String(s.base_stat) }
            }
          }
        })
      }
    } :
    {}
}

export default {
  getLast,
  update,
}
