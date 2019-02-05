$directory = "openInStorm.js";
$userScripts = glob($directory . "*.js");

foreach($userScripts as $userScript)
{
	echo "<a href=$userScript>".basename($userScript)."</a>";
}