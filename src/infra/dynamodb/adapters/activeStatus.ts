import { ScanCommand, PutItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb"
import { unmarshall } from "@aws-sdk/util-dynamodb"
import { client } from "../config.js";
import { ActiveStatus } from "types/activeStatus.js";

let inMemory = undefined

async function update(pokemon?) {
  console.log("Inserting: ", pokemon)
  const response = await client.send(new PutItemCommand({
    "TableName": "LastPokemonHistory",
    "Item": pokemon ? mapToDynamoDB(pokemon) : emptyItem()
  }))
  inMemory = undefined
  return response
}

async function getLast(): Promise<ActiveStatus> {
  if (inMemory)
    return inMemory

  const response = await client.send(new ScanCommand({
    TableName: "LastPokemonHistory",
    FilterExpression: "resolved_date = :defined",
    Select: "ALL_ATTRIBUTES",
    ExpressionAttributeValues: {
      ":defined": {
        "N": "0"
      }
    }
  }))

  const lastItem = response.Items?.at(0)

  if (!lastItem)
    return

  const status = mapDynamoToActiveStatus(lastItem)

  inMemory = status

  return status
}

function emptyItem() {
  return {
    "date": {
      "N": String(new Date().getTime())
    },
    "resolved_date": {
      "N": "0"
    }
  }
}

function mapDynamoToActiveStatus(entry): ActiveStatus {
  const e = unmarshall(entry)

  const status: ActiveStatus = {
    date: new Date(e.date),
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
  return {
    date: { N: String(new Date().getTime()) },
    chance: { N: String(pokemon.chance.toString()) },
    id: { N: String(pokemon.id.toString()) },
    name: { S: pokemon.name },
    shiny: { BOOL: String(pokemon.shiny) },
    resolved_date: { N: "0" },
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
  }
}

export function resolveStatus(asOf: string) {
  return client.send(new UpdateItemCommand({
    "TableName": "LastPokemonHistory",
    "Key": {
      "date": {
        "N": asOf
      }
    },
    "UpdateExpression": "SET resolved_date = :myValueRef",
    "ExpressionAttributeValues": {
      ":myValueRef": {
        "N": new Date().getTime().toString()
      }
    }
  }))
}

export default {
  getLast,
  update,
}
