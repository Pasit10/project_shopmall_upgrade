package entities

type UserLogin struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type UserAuth struct {
	UID       string `json:"uid"`
	Email     string `json:"email"`
	Password  string `json:"password"`
	Name      string `json:"name"`
	Picture   string `json:"picture"`
	Address   string `json:"address"`
	Role      string `json:"role"`
	Logintype string `json:"login_type"`
}

type UserData struct {
	UID       string `json:"uid"`
	Email     string `json:"email"`
	Name      string `json:"name"`
	Picture   string `json:"picture"`
	Address   string `json:"address"`
	Tel       string `json:"tel"`
	Role      string `json:"role"`
	Logintype string `json:"login_type"`
}
