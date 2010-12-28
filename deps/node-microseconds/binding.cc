#include <node.h>
#include <sys/time.h>

using namespace v8;
using namespace node;


Handle<Value>
milliseconds(const Arguments& args)
{
  timeval t1;
  HandleScope scope;
  gettimeofday(&t1, NULL);
  return Number::New((double)t1.tv_sec * 1000.0 + (double)t1.tv_usec / 1000.0);
}

extern "C" void
init (Handle<Object> target) 
{
  HandleScope scope;
  Local<FunctionTemplate> _milliseconds = FunctionTemplate::New(milliseconds);
  target->Set(String::New("milliseconds"), _milliseconds->GetFunction());
}
