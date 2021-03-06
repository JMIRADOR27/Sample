<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\UsersResource;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Validator;


class UserController extends Controller
{
    //
     /**
     * @var User
     */
    protected $user;

    /**
     * UsersController constructor.
     *
     * @param User $user
     */
    public function __construct(User $user)
    {
        $this->user = $user;
    }

    /**
     * List of users in Json format
     *
     * @param Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */

    public function index(Request $request)
    {
        $query = $this->user->orderBy($request->column, $request->order);
        $users = $query->paginate($request->per_page ?? 5);

        return UsersResource::collection($users);
        $name = $request->input('name');
        $email = $request->input('email');
        $data = array('name' => $name, 'email' => $email);
    }

   public function create(Request $request){
       $status = 0;
    $Validation = [
        'name' => 'required',
        'email' => 'required|email'
    ];
    $validator = Validator::make($request->all(),$Validation);
    if($validator->fails()){
        return array('status' => $status, 'message' => 'Invalid Input');
    }else{
        try {
            $TableUser = new User;
            
            $TableUser->name = $request->input('name');
            $TableUser->email = $request->input('email');
            $TableUser->save();
            $status = 1;
            
            return array('status' => $status, 'message' => 'Success');

        }catch(Exception $e){
            return $e;
        }
    }
   }
   
   public function destroy($id){
    $TableUser = User::findOrFail($id);

    $TableUser->delete();
    return Redirect::back()->withErrors(['msg' => 'Error API!']);

   }
}
