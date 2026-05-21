error id: 9dLtv/QSj/bVepRT8xwa2A==
### Bloop error:

java.lang.RuntimeException: java.lang.NullPointerException: Cannot invoke "java.nio.file.Path.resolve(String)" because "options.targetroot" is null
	at jdk.compiler/com.sun.tools.javac.api.JavacTaskImpl.invocationHelper(JavacTaskImpl.java:168)
	at jdk.compiler/com.sun.tools.javac.api.JavacTaskImpl.doCall(JavacTaskImpl.java:100)
	at jdk.compiler/com.sun.tools.javac.api.JavacTaskImpl.call(JavacTaskImpl.java:94)
	at bloop.CompilerCache$BloopJavaCompiler.run(CompilerCache.scala:300)
	at sbt.internal.inc.javac.AnalyzingJavaCompiler.$anonfun$compile$12(AnalyzingJavaCompiler.scala:173)
	at scala.runtime.java8.JFunction0$mcV$sp.apply(JFunction0$mcV$sp.java:23)
	at sbt.internal.inc.javac.AnalyzingJavaCompiler.timed(AnalyzingJavaCompiler.scala:263)
	at sbt.internal.inc.javac.AnalyzingJavaCompiler.compile(AnalyzingJavaCompiler.scala:161)
	at sbt.internal.inc.bloop.internal.BloopHighLevelCompiler.$anonfun$compile$11(BloopHighLevelCompiler.scala:197)
	at scala.runtime.java8.JFunction0$mcV$sp.apply(JFunction0$mcV$sp.java:23)
	at sbt.internal.inc.bloop.internal.BloopHighLevelCompiler.$anonfun$compile$1(BloopHighLevelCompiler.scala:73)
	at bloop.tracing.NoopTracer$.trace(BraveTracer.scala:53)
	at sbt.internal.inc.bloop.internal.BloopHighLevelCompiler.timed$1(BloopHighLevelCompiler.scala:72)
	at sbt.internal.inc.bloop.internal.BloopHighLevelCompiler.$anonfun$compile$10(BloopHighLevelCompiler.scala:190)
	at scala.runtime.java8.JFunction0$mcV$sp.apply(JFunction0$mcV$sp.java:23)
	at monix.eval.internal.TaskRunLoop$.startFull(TaskRunLoop.scala:81)
	at monix.eval.internal.TaskRestartCallback.syncOnSuccess(TaskRestartCallback.scala:101)
	at monix.eval.internal.TaskRestartCallback.onSuccess(TaskRestartCallback.scala:74)
	at monix.eval.internal.TaskExecuteOn$AsyncRegister$$anon$1.run(TaskExecuteOn.scala:71)
	at java.base/java.util.concurrent.ForkJoinTask$RunnableExecuteAction.exec(ForkJoinTask.java:1423)
	at java.base/java.util.concurrent.ForkJoinTask.doExec(ForkJoinTask.java:387)
	at java.base/java.util.concurrent.ForkJoinPool$WorkQueue.topLevelExec(ForkJoinPool.java:1312)
	at java.base/java.util.concurrent.ForkJoinPool.scan(ForkJoinPool.java:1843)
	at java.base/java.util.concurrent.ForkJoinPool.runWorker(ForkJoinPool.java:1808)
	at java.base/java.util.concurrent.ForkJoinWorkerThread.run(ForkJoinWorkerThread.java:188)
Caused by: java.lang.NullPointerException: Cannot invoke "java.nio.file.Path.resolve(String)" because "options.targetroot" is null
	at com.sourcegraph.shaded.com.sourcegraph.semanticdb_javac.SemanticdbTaskListener.semanticdbOutputPath(SemanticdbTaskListener.java:296)
	at com.sourcegraph.shaded.com.sourcegraph.semanticdb_javac.SemanticdbTaskListener.started(SemanticdbTaskListener.java:54)
	at jdk.compiler/com.sun.tools.javac.api.ClientCodeWrapper$WrappedTaskListener.started(ClientCodeWrapper.java:865)
	at jdk.compiler/com.sun.tools.javac.api.MultiTaskListener.started(MultiTaskListener.java:120)
	at jdk.compiler/com.sun.tools.javac.main.JavaCompiler.enterTrees(JavaCompiler.java:1068)
	at jdk.compiler/com.sun.tools.javac.main.JavaCompiler.compile(JavaCompiler.java:947)
	at jdk.compiler/com.sun.tools.javac.api.JavacTaskImpl.lambda$doCall$0(JavacTaskImpl.java:104)
	at jdk.compiler/com.sun.tools.javac.api.JavacTaskImpl.invocationHelper(JavacTaskImpl.java:152)
	... 24 more
#### Short summary: 

java.lang.RuntimeException: java.lang.NullPointerException: Cannot invoke "java.nio.file.Path.resolv...