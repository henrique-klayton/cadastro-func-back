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
			tap((val: unknown) => {
				// TODO Enable only in dev mode
				if (context.getType<GqlContextType>() === "graphql") {
					const ctx = GqlExecutionContext.create(context);
					console.log(val, val?.constructor.name);
					const res = ctx.getContext().res;
					if (res != null) {
						console.log(res);
					}
					const info: GraphQLResolveInfo = ctx.getInfo();
					const fragments = info.fragments;
					console.log(info.path); // Query/Mutation/Susbcription name and type
					console.log(info.rootValue); // undefined?
					console.log(info.parentType.name); // Is Query/Mutation/Susbcription
					console.log(info.fieldName);
					console.log(info.fieldNodes);
					if (info.returnType instanceof GraphQLNonNull) {
						const ofType = info.returnType.ofType;
						if (!(ofType instanceof GraphQLList)) {
							console.log(ofType.name);
							if (ofType.name.startsWith("Paginated")) {
								console.log(JSON.stringify(info.variableValues)); // Request Input
								// console.log(ofType); // Output Values?
							}
						}
					}
				}
			}),
		);
	}
}
