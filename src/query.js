import { createWhereArgs } from './args'
import { parseResolveInfo, simplify } from 'graphql-parse-resolve-info'
import {GraphQLNonNull, GraphQLList} from 'graphql'
import { genFakeContent } from './fake'

const resolve = () => {}

export const getOne = (type, schemaTemplateData, userSchema) => {
  return {
    resolve(_, args, ctx, info) {
      const parsedInfo = parseResolveInfo(info)
      const queryInfo = simplify(parsedInfo, userSchema.getType(type.name))
      return genFakeContent(queryInfo, type.fields)
    },
    type: new GraphQLNonNull(userSchema.getType(type.name))
  }
}

export const getMany = (type, schemaTemplateData, userSchema) => {
  return {
    resolve(_, args, ctx, info) {
      const parsedInfo = parseResolveInfo(info)
      const queryInfo = simplify(parsedInfo, userSchema.getType(type.name))
      
      return [
        genFakeContent(queryInfo, type.fields),
        genFakeContent(queryInfo, type.fields),
        genFakeContent(queryInfo, type.fields)
      ]
    },
    args: {
      where: {type: createWhereArgs(type, userSchema)}
    },
    type: new GraphQLNonNull(new GraphQLList(userSchema.getType(type.name)))
  }
}

export const getPage = (type, schemaTemplateData, userSchema) => {
  return {
    resolve,
    type: userSchema.getType(type.name)
  }
}
