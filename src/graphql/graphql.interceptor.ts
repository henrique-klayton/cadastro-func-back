import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from "@nestjs/common";
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";
import { GraphQLList, GraphQLNonNull, GraphQLResolveInfo } from "graphql";
import { Observable, tap } from "rxjs";

@Injectable()
export class GraphqlInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
		return next.handle().pipe(
			tap((res: unknown) => {
				if (context.getType<GqlContextType>() === "graphql") {
					// Request Info
					console.log("REQUEST INFO");
					const ctx = GqlExecutionContext.create(context);
					const info: GraphQLResolveInfo = ctx.getInfo();
					console.log(`Request Type: ${info.parentType.name}`); // Query/Mutation/Susbcription
					console.log(`Path name: ${info.fieldName}`); // Path name

					if (info.returnType instanceof GraphQLNonNull) {
						const ofType = info.returnType.ofType;
						if (!(ofType instanceof GraphQLList)) {
							console.log(`Args Type: ${ofType.name}`); // Request InputType name
							console.log("Args Value:", info.variableValues); // Request input values
							if (ofType.name.startsWith("Paginated")) {
								// Pagination related
							}
						}
					}

					// Response Info
					console.log("\n\nRESPONSE INFO");
					console.log(`Response ${res?.constructor.name}:`);
					console.log(res); // Result value
				}
			}),
		);
	}
}
