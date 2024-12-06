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
			tap(() => {
				if (context.getType<GqlContextType>() === "graphql") {
					const ctx = GqlExecutionContext.create(context);
					const info: GraphQLResolveInfo = ctx.getInfo();
					const fragments = info.fragments;
					console.log(info.path);
					console.log(info.rootValue);
					console.log(info.parentType.name);
					if (info.returnType instanceof GraphQLNonNull) {
						const ofType = info.returnType.ofType;
						if (!(ofType instanceof GraphQLList)) console.log(ofType.name);
					}
				}
			}),
		);
	}
}
